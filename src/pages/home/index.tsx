import { useEffect, useRef, useState } from "react"
import { Form, Input, Image } from "antd"
import { queryUserInfoReq } from "./api"
import "./index.less"

const Home: React.FC = () => {
  const isUseEffect = useRef(false)
  const [form] = Form.useForm()
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (isUseEffect?.current) return

    isUseEffect.current = true

    /** 查询登录用户信息 - 操作 */
    queryUserInfoFn()
  })

  /**
   * 查询登录用户信息 - 操作
   * @returns
   */
  const queryUserInfoFn = async () => {
    const result = await queryUserInfoReq()
    form.setFieldsValue({...result});
    setAvatar(result?.avatar || "");
  }

  return (
    <div className="dm_change_password">
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: 520 }}
        form={form}
      >
        <Form.Item label="手机号码" name="phone">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="昵称" name="nickname">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="头像" name="avatar">
          {
            avatar ? (
              <Image src={ avatar } width={ 80 } />
            ) : "-"
          }
        </Form.Item>

        <Form.Item label="注册时间" name="createdAt">
          <Input readOnly />
        </Form.Item>
      </Form>
    </div>
  )
}

export default Home
