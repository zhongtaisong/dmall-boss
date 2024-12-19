import { useEffect, useRef } from "react"
import { Button, Form, Input, Popconfirm, Space, Table } from "antd"
import {
  addGoodsReq,
  deleteGoodsReq,
  queryGoodsListReq,
  updateGoodsReq,
} from "./api"
import { getStateFn, onToggleModalChange, onUpdateStateChange } from "./slice"
import { useAppDispatch, useAppSelector } from "@app/hooks"
import { PAGE_SIZE } from "@axios/config"
import type { IAddGoodsParams, IParams, IRow } from "./types"
import GoodsModal from "./components/goods-modal"
import "./index.less"

const GoodsList: React.FC = () => {
  const dispatch = useAppDispatch()
  const { modalInfo, searchParams, dataSource, total, dmActions, } =
    useAppSelector(getStateFn)
  const isUseEffect = useRef(false)

  useEffect(() => {
    if (isUseEffect?.current) return

    isUseEffect.current = true

    /** 查询列表 - 操作 */
    queryGoodsListFn()
  })

  /**
   * 查询列表 - 操作
   * @param params
   */
  const queryGoodsListFn = async (params?: Partial<IParams>) => {
    const params_new = {
      ...searchParams,
      ...params,
    }
    const result = await queryGoodsListReq(params_new)

    const list = result?.content || []
    const pageNum = params_new?.pageNum
    if (!list?.length && pageNum > 0) {
      return queryGoodsListFn({
        pageNum: pageNum - 1,
      })
    }

    dispatch(
      onUpdateStateChange([
        { key: "dataSource", value: list },
        { key: "total", value: result?.total ?? 0 },
        { key: "searchParams", value: params_new || {} },
        { key: "dmActions", value: result?.actions || [] },
      ]),
    )
  }

  /**
   * 删除
   * @param row
   */
  const onDeleteClick = async (row: IRow) => {
    if (!row || !Object.keys(row).length) return

    const { id } = row
    if (!id) return

    const result = await deleteGoodsReq(id)
    if (!result) return

    /** 查询列表 - 操作 */
    queryGoodsListFn()
  }

  /**
   * 新增、编辑 - 操作
   * @param row
   */
  const onUpdateClick = async (params: IAddGoodsParams) => {
    if (!params || !Object.keys(params).length) return

    const { id } = modalInfo || {}

    let result = false
    if (!id) {
      result = await addGoodsReq(params)
    } else {
      result = await updateGoodsReq({
        ...params,
        id,
      })
    }
    if (!result) return

    dispatch(
      onToggleModalChange({
        key: "isGoodsModalVisible",
        value: false,
      }),
    )
    /** 查询列表 - 操作 */
    queryGoodsListFn()
  }

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
            })
          }}
        >
          <Form.Item label="商品名称" name="brand_name">
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
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
            disabled={ !dmActions.includes("add") }
          >
            新增商品
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
              })
            },
          }}
          rowKey="id"
          bordered
        >
          <Table.Column
            key="index"
            dataIndex="index"
            title="序号"
            render={(_text, _row, index) => index + 1}
            width={80}
          />

          <Table.Column
            key="goods_name"
            title="商品名称"
            dataIndex="goods_name"
            render={text => text || "-"}
          />

          <Table.Column
            key="goods_price"
            title="价格"
            dataIndex="goods_price"
            render={text => text || "-"}
            width={ 120 }
          />

          <Table.Column
            key="createdAt"
            title="创建时间"
            dataIndex="createdAt"
            render={text => text || "-"}
            width={ 160 }
          />

          <Table.Column
            key="updatedAt"
            title="更新时间"
            dataIndex="updatedAt"
            render={text => text || "-"}
            width={ 160 }
          />

          <Table.Column
            key="action"
            title="操作"
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
                    编辑
                  </Button>
                  <Popconfirm
                    title="提示"
                    description="确定删除？"
                    onConfirm={() => onDeleteClick(row)}
                    disabled={!dmActions?.includes?.("delete")}
                  >
                    <Button disabled={!dmActions?.includes?.("delete")}>删除</Button>
                  </Popconfirm>
                </Space>
              )
            }}
            width={180}
          />
        </Table>
      </Space>

      <GoodsModal onOKClick={values => onUpdateClick?.(values)} />
    </div>
  )
}

export default GoodsList
