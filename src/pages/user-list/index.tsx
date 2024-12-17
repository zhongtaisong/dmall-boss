import { useEffect, useRef } from "react"
import { Button, Form, Input, Popconfirm, Space, Table, 
  Image,
  Modal,
} from "antd"
import {
  addUserReq,
  deleteUserReq,
  queryUserListReq,
  updateUserReq,
  updateUserResetPasswordReq,
} from "./api"
import { getStateFn, onToggleModalChange, onUpdateStateChange } from "./slice"
import { useAppDispatch, useAppSelector } from "@app/hooks"
import { PAGE_SIZE } from "@axios/config"
import type { IAddUserParams, IParams, IRow } from "./types"
import FormModal from "./components/form-modal"
import "./index.less"

const UserList: React.FC = () => {
  const dispatch = useAppDispatch()
  const { 
    modalInfo, searchParams, 
    dataSource, total, 
  } = useAppSelector(getStateFn)
  const isUseEffect = useRef(false)

  useEffect(() => {
    if (isUseEffect?.current) return

    isUseEffect.current = true

    /** 查询列表 - 操作 */
    queryUserListFn()
  })

  /**
   * 查询列表 - 操作
   * @param params
   */
  const queryUserListFn = async (params?: Partial<IParams>) => {
    const params_new = {
      ...searchParams,
      ...params,
    }
    const result = await queryUserListReq(params_new)

    const list = result?.content || []
    const pageNum = params_new?.pageNum
    if (!list?.length && pageNum > 0) {
      return queryUserListFn({
        pageNum: pageNum - 1,
      })
    }

    dispatch(
      onUpdateStateChange([
        { key: "dataSource", value: list },
        { key: "total", value: result?.total ?? 0 },
        { key: "searchParams", value: params_new || {} },
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

    const result = await deleteUserReq(id)
    if (!result) return

    /** 查询列表 - 操作 */
    queryUserListFn()
  }

  /**
   * 新增、编辑 - 操作
   * @param row
   */
  const onUpdateClick = async (params: IAddUserParams) => {
    if (!params || !Object.keys(params).length) return

    const { id } = modalInfo || {}

    let result = false
    if (!id) {
      result = await addUserReq(params)
    } else {
      result = await updateUserReq({
        ...params,
        id,
      })
    }
    if (!result) return

    dispatch(
      onToggleModalChange({
        key: "isVisible",
        value: false,
      }),
    )
    /** 查询列表 - 操作 */
    queryUserListFn()
  }

  /**
   * 重置用户密码 - 操作
   * @param params 
   * @returns 
   */
  const onResetPasswordClick = async (params: IObject) => {
    if(!params || !Object.keys(params).length) return;

    const result = await updateUserResetPasswordReq(params);
    if(!result) return;

    Modal.info({
      title: "提示",
      content: `重置后的用户密码为：${ result }`,
    });
  }

  return (
    <div className="dm_user_list">
      <Space direction="vertical" style={{ width: "100%" }} size={22}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          layout="inline"
          onFinish={values => {
            /** 查询列表 - 操作 */
            queryUserListFn({
              pageNum: 0,
              ...values,
            })
          }}
        >
          <Form.Item label="手机号码" name="phone">
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
                  key: "isVisible",
                  value: true,
                }),
              )
            }
          >
            新增用户
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
              queryUserListFn({
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
            key="phone"
            title="手机号码"
            dataIndex="phone"
            render={text => text || "-"}
          />

          <Table.Column
            key="nickname"
            title="昵称"
            dataIndex="nickname"
            render={text => text || "-"}
            width="30%"
          />

          <Table.Column
            key="avatar"
            title="头像"
            dataIndex="avatar"
            render={text => {
              const url = text?.[0] || "";
              if(!url) return "-";

              return (
                <Image src={ url } />
              );
            }}
            width={ 100 }
          />

          <Table.Column
            key="createdAt"
            title="创建时间"
            dataIndex="createdAt"
            render={text => text || "-"}
          />

          <Table.Column
            key="updatedAt"
            title="更新时间"
            dataIndex="updatedAt"
            render={text => text || "-"}
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
                          key: "isVisible",
                          value: true,
                          params: row || {},
                        }),
                      )
                    }
                  >
                    编辑
                  </Button>

                  <Button
                    type="primary"
                    onClick={() => onResetPasswordClick(row)}
                  >
                    重置用户密码
                  </Button>

                  <Popconfirm
                    title="提示"
                    description="确定删除？"
                    onConfirm={() => onDeleteClick(row)}
                  >
                    <Button>删除</Button>
                  </Popconfirm>
                </Space>
              )
            }}
            width={296}
          />
        </Table>
      </Space>

      <FormModal onOKClick={values => onUpdateClick?.(values)} />
    </div>
  )
}

export default UserList
