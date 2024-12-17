import { useEffect, useRef } from "react"
import {
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
} from "antd"
import {
  loginUserReq,
} from "./api"
import background_png from "@assets/imgs/background.png"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import "./index.less"
import { Link } from "react-router"

const Login: React.FC = () => {
  const isUseEffect = useRef(false)

  useEffect(() => {
    if (isUseEffect?.current) return

    isUseEffect.current = true
  })

  /**
   * 登录 - 操作
   * @param values 
   */
  const onLoginClick = async (values: IObject) => {
    if(!values || !Object.keys(values).length) return;

    const result = await loginUserReq(values);
  }

  return (
    <div
      className="dm_login"
      style={{
        backgroundImage: `url(${background_png})`,
      }}
    >
      <div className="dm_login__body">
        <Form
          initialValues={{ remember: true }}
          onFinish={(values) => onLoginClick?.(values)}
          autoComplete="off"
        >
          <Form.Item
            name="phone"
            rules={[{ 
              required: true, 
              message: "请输入手机号码", 
            }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入手机号码" maxLength={ 11 } />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ 
              required: true, 
              message: "请输入密码", 
            }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住账号</Checkbox>
              </Form.Item>

              <Link to="/register">忘记密码</Link>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              登录
            </Button>
            或 <Link to="/register">注册</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
