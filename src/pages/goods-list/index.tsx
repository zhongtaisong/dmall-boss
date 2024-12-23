import { useEffect, useRef } from "react";
import { Button, Form, Input, Popconfirm, Space, Table } from "antd";
import {
  addGoodsReq,
  deleteGoodsReq,
  queryGoodsListReq,
  updateGoodsReq,
} from "./api";
import { getStateFn, onToggleModalChange, onUpdateStateChange } from "./slice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { PAGE_SIZE } from "@axios/config";
import type { IAddGoodsParams, IParams, IRow } from "./types";
import GoodsModal from "./components/goods-modal";
import { useTranslation } from "react-i18next";
import "./index.less";

const GoodsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { modalInfo, searchParams, dataSource, total, dmActions } =
    useAppSelector(getStateFn);
  const isUseEffect = useRef(false);

  useEffect(() => {
    if (isUseEffect?.current) return;

    isUseEffect.current = true;

    /** 查询列表 - 操作 */
    queryGoodsListFn();
  });

  /**
   * 查询列表 - 操作
   * @param params
   */
  const queryGoodsListFn = async (params?: Partial<IParams>) => {
    const params_new = {
      ...searchParams,
      ...params,
    };
    const result = await queryGoodsListReq(params_new);

    const list = result?.content || [];
    const pageNum = params_new?.pageNum;
    if (!list?.length && pageNum > 0) {
      return queryGoodsListFn({
        pageNum: pageNum - 1,
      });
    }

    dispatch(
      onUpdateStateChange([
        { key: "dataSource", value: list },
        { key: "total", value: result?.total ?? 0 },
        { key: "searchParams", value: params_new || {} },
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

    const result = await deleteGoodsReq(id);
    if (!result) return;

    /** 查询列表 - 操作 */
    queryGoodsListFn();
  };

  /**
   * 新增、编辑 - 操作
   * @param row
   */
  const onUpdateClick = async (params: IAddGoodsParams) => {
    if (!params || !Object.keys(params).length) return;

    const { id } = modalInfo || {};

    let result = false;
    if (!id) {
      result = await addGoodsReq(params);
    } else {
      result = await updateGoodsReq({
        ...params,
        id,
      });
    }
    if (!result) return;

    dispatch(
      onToggleModalChange({
        key: "isGoodsModalVisible",
        value: false,
      }),
    );
    /** 查询列表 - 操作 */
    queryGoodsListFn();
  };

  return (
    <div className="dm_goods_list">
      <Space direction="vertical" style={{ width: "100%" }} size={22}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          layout="inline"
          onFinish={values => {
            /** 查询列表 - 操作 */
            queryGoodsListFn({
              pageNum: 0,
              ...values,
            });
          }}
          labelWrap
        >
          <Form.Item label={t(`商品名称`)} name="brand_name">
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
            onClick={() =>
              dispatch(
                onToggleModalChange({
                  key: "isGoodsModalVisible",
                  value: true,
                }),
              )
            }
            disabled={!dmActions.includes("add")}
          >
            {t(`新增商品`)}
          </Button>
        </Space>

        <Table
          dataSource={dataSource || []}
          pagination={{
            current: searchParams?.pageNum + 1,
            pageSize: searchParams?.pageSize || PAGE_SIZE,
            total: total ?? 0,
            showTotal: n => `共 ${n} 条`,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (num, size) => {
              /** 查询列表 - 操作 */
              queryGoodsListFn({
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
            key="goods_name"
            title={t(`商品名称`)}
            dataIndex="goods_name"
            render={text => text || "-"}
          />

          <Table.Column
            key="goods_price"
            title={t(`价格`)}
            dataIndex="goods_price"
            render={text => text || "-"}
            width={120}
          />

          <Table.Column
            key="createdAt"
            title={t(`创建时间`)}
            dataIndex="createdAt"
            render={text => text || "-"}
            width={160}
          />

          <Table.Column
            key="updatedAt"
            title={t(`更新时间`)}
            dataIndex="updatedAt"
            render={text => text || "-"}
            width={160}
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
                      dispatch(
                        onToggleModalChange({
                          key: "isGoodsModalVisible",
                          value: true,
                          params: row || {},
                        }),
                      )
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

      <GoodsModal onOKClick={values => onUpdateClick?.(values)} />
    </div>
  );
};

export default GoodsList;
