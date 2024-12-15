import { useEffect, useRef, useState } from "react"
import { Button, Form, Input, Modal, Popconfirm, Space, Table } from "antd"
import { addGoodsBrandReq, deleteGoodsBrandReq, queryGoodsBrandListReq, updateGoodsBrandReq } from "./api"
import { getStateFn, onUpdateStateChange } from "./slice"
import { useAppDispatch, useAppSelector } from "@app/hooks"
import { PAGE_SIZE } from "@axios/config"
import type { IAddGoodsBrandParams, IParams, IRow } from "./types"
import "./index.less"

const GoodsBrand: React.FC = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(getStateFn);
  const isUseEffect = useRef(false);
  const [visible, setVisible] = useState<{
    value: boolean;
    data?: IObject;
  }>({
    value: false,
    data: {},
  });
  
  useEffect(() => {
    if(isUseEffect?.current) return;

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
    }
    const result = await queryGoodsBrandListReq(params_new);

    const list = result?.content || [];
    const pageNum = params_new?.pageNum;
    if(!list?.length && pageNum > 0) {
      return queryGoodsBrandListFn({
        pageNum: pageNum - 1,
      });
    }

    dispatch(onUpdateStateChange([
      { key: "dataSource", value: list, },
      { key: "total", value: result?.total ?? 0, },
      { key: "params", value: params_new || {}, },
    ]));
  }

  /**
   * 删除
   * @param row 
   */
  const onDeleteClick = async (row: IRow) => {
    if(!row || !Object.keys(row).length) return;
    
    const { id, } = row;
    if(!id) return;

    const result = await deleteGoodsBrandReq(id);
    if(!result) return;
    
    /** 查询列表 - 操作 */
    queryGoodsBrandListFn();
  }

  /**
   * 新增、编辑 - 操作
   * @param row 
   */
  const onUpdateClick = async (params: IAddGoodsBrandParams) => {
    if(!params || !Object.keys(params).length) return;

    const { id, brand_name, } = visible?.data || {};
    if(brand_name === params?.brand_name) {
      return setVisible({ value: false, });
    };

    if(id) {
      Object.assign(params, {
        id,
      })
    }
    
    const result = await (!id ? addGoodsBrandReq(params) : updateGoodsBrandReq(params));
    if(!result) return;
    
    setVisible({ value: false, });
    /** 查询列表 - 操作 */
    queryGoodsBrandListFn();
  }

  return (
    <div className="dm_goods_brand">
      <Space 
        direction="vertical" 
        style={{ width: "100%" }}
        size={ 22 }
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          layout="inline"
          onFinish={(values) => {
            /** 查询列表 - 操作 */
            queryGoodsBrandListFn({
              pageNum: 0,
              ...values,
            });
          }}
        >
          <Form.Item label="品牌名称" name="brand_name">
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
            onClick={() => setVisible({ value: true, })}
          >新增品牌</Button>
        </Space>

        <Table 
          dataSource={ state?.dataSource || [] } 
          pagination={{
            current: state?.params?.pageNum + 1,
            pageSize: state?.params?.pageSize || PAGE_SIZE,
            total: state?.total ?? 0,
            showTotal: (n) => `共 ${ n } 条`,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (num, size) => {
              /** 查询列表 - 操作 */
              queryGoodsBrandListFn({
                pageNum: num - 1,
                pageSize: size,
              });
            }
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
            key="brand_name"
            title="品牌名称"
            dataIndex="brand_name"
            render={text => text || "-"}
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
                    onClick={() => setVisible({
                      value: true,
                      data: row,
                    })}
                  >编辑</Button>
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
            width={180}
          />
        </Table>
      </Space>

      <Modal
        open={ visible?.value }
        title={ `${ !visible?.data?.id ? "新增" : "编辑" }品牌` }
        okButtonProps={{ htmlType: 'submit', }}
        onCancel={() => setVisible({ value: false, })}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            clearOnDestroy
            onFinish={(values) => onUpdateClick(values)}
            autoComplete="off"
          >
            { dom }
          </Form>
        )}
      >
        <Form.Item
          name="brand_name"
          label="品牌名称"
          rules={[{ 
            required: true, 
            message: '请输入',
          }]}
          initialValue={ visible?.data?.brand_name ?? null }
        >
          <Input
            placeholder="请输入"
            maxLength={ 30 }
          />
        </Form.Item>
      </Modal>
    </div>
  )
}

export default GoodsBrand
