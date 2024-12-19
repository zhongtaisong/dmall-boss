import { useEffect, } from "react"
import { Form, Input, Button } from "antd"
import { getUserInfoFn } from "@utils/common"
import DmUpload from "@components/dm-upload"
import "./index.less"
import { updateInfoReq } from "./api"
import { eventBus } from "@utils/event-bus"

const Home: React.FC = () => {
  const [form] = Form.useForm()
  const userInfo = getUserInfoFn()

  useEffect(() => {
    form.setFieldsValue({
      ...userInfo,
      avatar: userInfo?.avatar ? [
        {
          uid: `-1`,
          name: "image.png",
          status: "done",
          url: userInfo?.avatar,
        },
      ] : [],
    })
  }, [form, userInfo])

  /**
   * 提交 - 操作
   * @param params
   */
  const onSubmitClick = async (params: IObject) => {
    if (!params || !Object.keys(params).length) return

    let imgs = params?.avatar
    if (Array.isArray(imgs) && imgs.length) {
      imgs = imgs
        .map(item => item?.response?.context?.[0] || item?.url || "")
        .filter(Boolean)
    } else {
      imgs = []
    }

    Object.assign(params, {
      avatar: imgs,
    })

    const result = await updateInfoReq(params)
    if (!result) return
    
    eventBus.emit("queryUserInfo");
  }

  return (
    <div className="dm_change_password">
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: 520 }}
        form={form}
        onFinish={values => onSubmitClick?.(values)}
        autoComplete="off"
      >
        <Form.Item label="手机号码" name="phone" required>
          <Input readOnly />
        </Form.Item>

        <Form.Item
          label="昵称"
          name="nickname"
          rules={[
            {
              required: true,
              message: "请输入",
            },
          ]}
        >
          <Input placeholder="请输入" maxLength={30} />
        </Form.Item>

        <Form.Item
          label="头像"
          name="avatar"
          valuePropName="fileList"
          rules={[
            {
              required: true,
              message: "请上传",
            },
          ]}
        >
          <DmUpload
            name="user"
            isForm
            maxCount={1}
            action="/image/upload/user"
          />
        </Form.Item>

        <Form.Item label="注册时间" name="createdAt">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="更新时间" name="updatedAt">
          <Input readOnly />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Home
