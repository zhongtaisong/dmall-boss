import { useEffect, } from "react"
import { Form, Input, Image } from "antd"
import { getUserInfoFn } from "@utils/common"
import "./index.less"

const Home: React.FC = () => {
  const [form] = Form.useForm()
  const user_info = getUserInfoFn()
  const avatar = user_info?.avatar || "";

  useEffect(() => {
    form.setFieldsValue({...user_info});
  }, [form, user_info])
  

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
