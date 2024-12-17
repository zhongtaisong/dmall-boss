import { useAppDispatch, useAppSelector } from "@app/hooks"
import { getStateFn, onToggleModalChange } from "@pages/user-list/slice"
import { Form, Input, Modal } from "antd"
import DmUpload from "@components/dm-upload"
import type { IAddUserParams } from "@pages/user-list/types"
import { useMemo } from "react"
import type { UploadFile } from "antd"
import { phoneReg } from "@utils/regular-expression"

interface IProps {
  onOKClick: (values: IAddUserParams) => void
}

export default function FormModal(props: IProps) {
  const dispatch = useAppDispatch()
  const { isVisible, modalInfo } = useAppSelector(getStateFn)
  const avatar = modalInfo?.avatar
  const id = modalInfo?.id
  const avatar_imgs_list = useMemo(() => {
    if (!Array.isArray(avatar)) return []

    return (
      avatar
        .map((item, index) => {
          if (!item) return null

          return {
            uid: `-${index + 1}`,
            name: "image.png",
            status: "done",
            url: item,
          }
        })
        ?.filter?.(Boolean) || []
    )
  }, [avatar]) as UploadFile[]

  return (
    <Modal
      open={isVisible}
      title={`${!modalInfo?.id ? "新增" : "编辑"}用户`}
      okButtonProps={{ htmlType: "submit" }}
      onCancel={() =>
        dispatch(
          onToggleModalChange({
            key: "isVisible",
            value: false,
          }),
        )
      }
      destroyOnClose
      modalRender={dom => (
        <Form
          layout="vertical"
          clearOnDestroy
          autoComplete="off"
          onFinish={values => {
            let imgs = values?.avatar
            if (Array.isArray(imgs) && imgs.length) {
              imgs = imgs
                .map(item => item?.response?.context?.[0] || item?.url || "")
                .filter(Boolean)
            } else {
              imgs = ""
            }

            Object.assign(values, {
              avatar: imgs,
            })

            delete values?.confirmPassword

            props?.onOKClick?.(values)
          }}
        >
          {dom}
        </Form>
      )}
    >
      <Form.Item
        label="手机号码"
        name="phone"
        rules={[
          {
            validator: (rule, value) => {
              if (!value?.trim?.()) {
                return Promise.reject("请输入手机号码")
              }

              if (!phoneReg.test(value)) {
                return Promise.reject("请输入合法的手机号码")
              }

              return Promise.resolve()
            },
          },
        ]}
        required
        initialValue={modalInfo?.phone}
      >
        <Input placeholder="请输入" maxLength={11} readOnly={Boolean(id)} />
      </Form.Item>

      {
        !id ? (
          <>
            <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: "请输入",
                },
              ]}
              // initialValue={modalInfo?.phone}
            >
              <Input.Password placeholder="请输入" readOnly={ Boolean(id) } />
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
          </>
        ) : null
      }

      <Form.Item
        label="昵称"
        name="nickname"
        rules={[
          {
            required: true,
            message: "请输入",
          },
        ]}
        initialValue={modalInfo?.nickname}
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
        initialValue={avatar_imgs_list}
      >
        <DmUpload
          name="user"
          isForm
          maxCount={1}
          fileList={avatar_imgs_list}
          action="/image/upload/user"
        />
      </Form.Item>
    </Modal>
  )
}
