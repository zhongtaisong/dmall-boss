import { useEffect, useRef } from "react";
import { Button, Form, Input } from "antd";
import { changeUserPasswordReq } from "./api";
import { getUserInfoFn, onEmitLogoutClick } from "@utils/common";
import { useTranslation } from "react-i18next";
import "./index.less";

const ChangePassword: React.FC = () => {
  const isUseEffect = useRef(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (isUseEffect?.current) return;

    isUseEffect.current = true;
  });

  const user_info = getUserInfoFn();

  /**
   * 提交 - 操作
   * @param params
   */
  const onSubmitClick = async (params: IObject) => {
    if (!params || !Object.keys(params).length) return;

    const result = await changeUserPasswordReq(params);
    if (!result) return;

    onEmitLogoutClick();
    form?.resetFields?.(["oldPassword", "password", "confirmPassword"]);
  };

  return (
    <div className="dm_change_password">
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
        onFinish={values => onSubmitClick?.(values)}
        style={{ width: 520 }}
        form={form}
        labelWrap
      >
        <Form.Item
          label={t(`手机号码`)}
          name="phone"
          required
          initialValue={user_info?.phone}
        >
          <Input readOnly />
        </Form.Item>

        <Form.Item
          label={t(`旧密码`)}
          name="oldPassword"
          rules={[
            {
              required: true,
              message: t(`请输入`),
            },
          ]}
        >
          <Input.Password placeholder={t(`请输入`)} />
        </Form.Item>

        <Form.Item
          label={t(`新密码`)}
          name="password"
          rules={[
            {
              required: true,
              message: t(`请输入`),
            },
          ]}
        >
          <Input.Password placeholder={t(`请输入`)} />
        </Form.Item>

        <Form.Item
          label={t(`确认新密码`)}
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: t(`请输入`),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t(`两次输入的新密码不一致`)));
              },
            }),
          ]}
        >
          <Input.Password placeholder={t(`请输入`)} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            {t(`提交`)}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
