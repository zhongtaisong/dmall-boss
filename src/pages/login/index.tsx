import { useEffect, useRef } from "react";
import { Button, Checkbox, Flex, Form, Input } from "antd";
import { loginUserReq } from "./api";
import background_png from "@assets/imgs/background.png";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import "./index.less";
import { Link, useNavigate } from "react-router";
import { getItem, removeItem, setItem } from "@analytics/storage-utils";
import { cache } from "@utils/cache";
import { useTranslation } from "react-i18next";

const Login: React.FC = () => {
  const isUseEffect = useRef(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (isUseEffect?.current) return;

    isUseEffect.current = true;
  });

  const account = getItem(cache.LOGIN_ACCOUNT) || "";

  /**
   * 登录 - 操作
   * @param values
   */
  const onLoginClick = async (values: IObject) => {
    if (!values || !Object.keys(values).length) return;

    const { remember, ...rest } = values;
    if (remember) {
      setItem(cache.LOGIN_ACCOUNT, values?.phone || "");
    } else {
      removeItem(cache.LOGIN_ACCOUNT);
    }

    const result = await loginUserReq(rest);
    if (!result) return;

    navigate("/");
  };

  return (
    <div
      className="dm_login"
      style={{
        backgroundImage: `url(${background_png})`,
      }}
    >
      <div className="dm_login__body">
        <Form
          initialValues={{
            phone: account,
            remember: true,
          }}
          onFinish={values => onLoginClick?.(values)}
          autoComplete="off"
        >
          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: t(`请输入手机号码`),
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t(`请输入手机号码`)}
              maxLength={11}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: t(`请输入密码`),
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t(`请输入密码`)}
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>{t(`记住账号`)}</Checkbox>
              </Form.Item>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              {t(`登录`)}
            </Button>
            {t(`或`)} <Link to="/register">{t(`注册`)}</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
