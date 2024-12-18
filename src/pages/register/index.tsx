import { useEffect, useRef } from "react"
import { Button, Form, Input, Space } from "antd"
import { registerUserReq } from "./api"
import background_png from "@assets/imgs/background.png"
import { Link, } from "react-router"
import { onNavigateToLoginClick } from "@utils/common"
import "./index.less"

const Register: React.FC = () => {
  const isUseEffect = useRef(false)

  useEffect(() => {
    if (isUseEffect?.current) return

    isUseEffect.current = true
  })

  /**
   * 注册 - 操作
   * @param values
   */
  const onRegisterClick = async (values: IObject) => {
    if (!values || !Object.keys(values).length) return

    delete values?.confirmPassword;

    const result = await registerUserReq(values)
    if(!result) return;

    onNavigateToLoginClick();
  }

  return (
    <div
      className="dm_register"
      style={{
        backgroundImage: `url(${background_png})`,
      }}
    >
      <div className="dm_register__body">
        <Form 
          labelCol={{ span: 7, }}
          wrapperCol={{ span: 17, }}
          onFinish={values => onRegisterClick?.(values)}
          autoComplete="off"
        >
          <Form.Item
            label="手机号码"
            name="phone"
            rules={[
              {
                required: true,
                message: "请输入手机号码",
              },
            ]}
          >
            <Input placeholder="请输入手机号码" maxLength={11} />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
          >
            <Input.Password placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "再次输入密码",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"))
                },
              }),
            ]}
          >
            <Input.Password placeholder="请输入" />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 7,
              span: 17,
            }}
          >
            <Space>
              <Button type="primary" htmlType="submit">
                注册
              </Button>

              <Link to="/login">去登录</Link>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Register
