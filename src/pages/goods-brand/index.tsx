import { useEffect, useRef, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Space, Table } from "antd";
import {
  addGoodsBrandReq,
  deleteGoodsBrandReq,
  queryGoodsBrandListReq,
  updateGoodsBrandReq,
} from "./api";
import { getStateFn, onUpdateStateChange } from "./slice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { PAGE_SIZE } from "@axios/config";
import type { IAddGoodsBrandParams, IParams, IRow } from "./types";
import { useTranslation } from "react-i18next";
import "./index.less";

const GoodsBrand: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { dmActions, ...state } = useAppSelector(getStateFn);
  const isUseEffect = useRef(false);
  const [visible, setVisible] = useState<{
    value: boolean;
    data?: IObject;
  }>({
    value: false,
    data: {},
  });

  useEffect(() => {
    if (isUseEffect?.current) return;

    isUseEffect.current = true;

    /** 查询列表 - 操作 */
    queryGoodsBrandListFn();
  });

  /**
   * 查询列表 - 操作
   * @param params
   */
  const queryGoodsBrandListFn = async (params?: Partial<IParams>) => {
    const params_new = {
      ...state?.params,
      ...params,
    };
    const result = await queryGoodsBrandListReq(params_new);

    const list = result?.content || [];
    const pageNum = params_new?.pageNum;
    if (!list?.length && pageNum > 0) {
      return queryGoodsBrandListFn({
        pageNum: pageNum - 1,
      });
    }

    dispatch(
      onUpdateStateChange([
        { key: "dataSource", value: list },
        { key: "total", value: result?.total ?? 0 },
        { key: "params", value: params_new || {} },
        { key: "dmActions", value: result?.actions || [] },
      ]),
    );
  };

  /**
   * 删除
   * @param row
   */
  const onDeleteClick = async (row: IRow) => {
    if (!row || !Object.keys(row).length) return;

    const { id } = row;
    if (!id) return;

    const result = await deleteGoodsBrandReq(id);
    if (!result) return;

    /** 查询列表 - 操作 */
    queryGoodsBrandListFn();
  };

  /**
   * 新增、编辑 - 操作
   * @param row
   */
  const onUpdateClick = async (params: IAddGoodsBrandParams) => {
    if (!params || !Object.keys(params).length) return;

    const { id, brand_name } = visible?.data || {};
    if (brand_name === params?.brand_name) {
      return setVisible({ value: false });
    }

    if (id) {
      Object.assign(params, {
        id,
      });
    }

    const result = await (!id
      ? addGoodsBrandReq(params)
      : updateGoodsBrandReq(params));
    if (!result) return;

    setVisible({ value: false });
    /** 查询列表 - 操作 */
    queryGoodsBrandListFn();
  };

  return (
    <div className="dm_goods_brand">
      <Space direction="vertical" style={{ width: "100%" }} size={22}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          layout="inline"
          onFinish={values => {
            /** 查询列表 - 操作 */
            queryGoodsBrandListFn({
              pageNum: 0,
              ...values,
            });
          }}
          labelWrap
        >
          <Form.Item label={t(`品牌名称`)} name="brand_name">
            <Input placeholder={t(`请输入`)} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t(`搜索`)}
            </Button>
          </Form.Item>
        </Form>

        <Space>
          <Button
            type="primary"
            onClick={() => setVisible({ value: true })}
            disabled={!dmActions.includes("add")}
          >
            {t(`新增品牌`)}
          </Button>
        </Space>

        <Table
          dataSource={state?.dataSource || []}
          pagination={{
            current: state?.params?.pageNum + 1,
            pageSize: state?.params?.pageSize || PAGE_SIZE,
            total: state?.total ?? 0,
            showTotal: n => t('共 {{total}} 条', { total: n }),
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (num, size) => {
              /** 查询列表 - 操作 */
              queryGoodsBrandListFn({
                pageNum: num - 1,
                pageSize: size,
              });
            },
          }}
          rowKey="id"
          bordered
        >
          <Table.Column
            key="index"
            dataIndex="index"
            title={t(`序号`)}
            render={(_text, _row, index) => index + 1}
            width={80}
          />

          <Table.Column
            key="brand_name"
            title={t(`品牌名称`)}
            dataIndex="brand_name"
            render={text => text || "-"}
          />

          <Table.Column
            key="createdAt"
            title={t(`创建时间`)}
            dataIndex="createdAt"
            render={text => text || "-"}
          />

          <Table.Column
            key="updatedAt"
            title={t(`更新时间`)}
            dataIndex="updatedAt"
            render={text => text || "-"}
          />

          <Table.Column
            key="action"
            title={t(`操作`)}
            dataIndex="action"
            render={(_text, row: IRow, _index) => {
              return (
                <Space>
                  <Button
                    type="primary"
                    onClick={() =>
                      setVisible({
                        value: true,
                        data: row,
                      })
                    }
                    disabled={!dmActions?.includes?.("upate")}
                  >
                    {t(`编辑`)}
                  </Button>
                  <Popconfirm
                    title={t(`提示`)}
                    description={t(`确定删除？`)}
                    onConfirm={() => onDeleteClick(row)}
                    disabled={!dmActions?.includes?.("delete")}
                  >
                    <Button disabled={!dmActions?.includes?.("delete")}>
                      {t(`删除`)}
                    </Button>
                  </Popconfirm>
                </Space>
              );
            }}
            width={180}
          />
        </Table>
      </Space>

      <Modal
        open={visible?.value}
        title={!visible?.data?.id ? t(`新增品牌`) : t(`编辑品牌`)}
        okButtonProps={{ htmlType: "submit" }}
        onCancel={() => setVisible({ value: false })}
        destroyOnClose
        modalRender={dom => (
          <Form
            layout="vertical"
            clearOnDestroy
            onFinish={values => onUpdateClick(values)}
            autoComplete="off"
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="brand_name"
          label={t(`品牌名称`)}
          rules={[
            {
              required: true,
              message: t(`请输入`),
            },
          ]}
          initialValue={visible?.data?.brand_name ?? null}
        >
          <Input placeholder={t(`请输入`)} maxLength={30} />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default GoodsBrand;
