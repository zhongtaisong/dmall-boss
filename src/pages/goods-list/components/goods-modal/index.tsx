import { useAppDispatch, useAppSelector } from "@app/hooks";
import { getStateFn, onToggleModalChange } from "@pages/goods-list/slice";
import { Form, Input, InputNumber, Modal } from "antd";
import DmUpload from "@components/dm-upload";
import type { IAddGoodsParams } from "@pages/goods-list/types";
import { useMemo } from "react";
import type { UploadFile } from "antd";
import { useTranslation } from "react-i18next";

interface IProps {
  onOKClick: (values: IAddGoodsParams) => void;
}

export default function GoodsModal(props: IProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { isGoodsModalVisible, modalInfo } = useAppSelector(getStateFn);
  const goodsImgs = modalInfo?.goods_imgs;
  const goods_imgs_list = useMemo(() => {
    if (!Array.isArray(goodsImgs)) return [];

    return (
      goodsImgs
        .map((item, index) => {
          if (!item) return null;

          return {
            uid: `-${index + 1}`,
            name: "image.png",
            status: "done",
            url: item,
          };
        })
        ?.filter?.(Boolean) || []
    );
  }, [goodsImgs]) as UploadFile[];

  return (
    <Modal
      open={isGoodsModalVisible}
      title={!modalInfo?.id ? t(`新增商品`) : t(`编辑商品`)}
      okButtonProps={{ htmlType: "submit" }}
      onCancel={() =>
        dispatch(
          onToggleModalChange({
            key: "isGoodsModalVisible",
            value: false,
          }),
        )
      }
      destroyOnClose
      modalRender={dom => (
        <Form
          layout="vertical"
          clearOnDestroy
          autoComplete="off"
          onFinish={values => {
            let goods_imgs = values?.goods_imgs;
            if (Array.isArray(goods_imgs) && goods_imgs.length) {
              goods_imgs = goods_imgs
                .map(item => item?.response?.context?.[0] || item?.url || "")
                .filter(Boolean);
            } else {
              goods_imgs = [];
            }

            Object.assign(values, {
              goods_imgs,
            });

            props?.onOKClick?.(values);
          }}
        >
          {dom}
        </Form>
      )}
      width={666}
    >
      <Form.Item
        label={t(`商品名称`)}
        name="goods_name"
        rules={[
          {
            required: true,
            message: t(`请输入`),
          },
        ]}
        initialValue={modalInfo?.goods_name}
      >
        <Input.TextArea placeholder={t(`请输入`)} maxLength={30} showCount />
      </Form.Item>

      <Form.Item
        label={t(`商品副标题`)}
        name="goods_subtitle"
        rules={[
          {
            required: true,
            message: t(`请输入`),
          },
        ]}
        initialValue={modalInfo?.goods_subtitle}
      >
        <Input.TextArea
          placeholder={t(`请输入`)}
          maxLength={300}
          autoSize={{ minRows: 7, maxRows: 8 }}
          showCount
        />
      </Form.Item>

      <Form.Item
        label={t(`价格`)}
        name="goods_price"
        rules={[
          {
            required: true,
            message: t(`请输入`),
          },
        ]}
        initialValue={modalInfo?.goods_price}
      >
        <InputNumber
          min={0}
          max={99999999.99}
          precision={2}
          style={{ width: 130 }}
          placeholder={t(`请输入`)}
        />
      </Form.Item>

      <Form.Item
        label={t(`商品图片`)}
        name="goods_imgs"
        valuePropName="fileList"
        rules={[
          {
            required: true,
            message: t(`请上传`),
          },
        ]}
        initialValue={goods_imgs_list}
      >
        <DmUpload
          name="goodsImgs"
          isForm
          maxCount={6}
          fileList={goods_imgs_list}
          action="/image/upload/goods"
        />
      </Form.Item>
    </Modal>
  );
}
