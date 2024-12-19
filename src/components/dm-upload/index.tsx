import { SERVICE_URL } from "@axios/config"
import { Upload, Image, Space } from "antd"
import type { GetProp, UploadFile, UploadProps } from "antd"
import { useState } from "react"
import { PlusOutlined } from "@ant-design/icons"
import { getUserInfoFn } from "@utils/common"

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0]

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })

interface IDmUploadProps extends UploadProps {
  isForm?: boolean
}

export default function DmUpload(props: IDmUploadProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [fileList, setFileList] = useState<UploadFile[]>(props?.fileList || [])
  const { maxCount = Infinity, isForm = true, action, ...restProps } = props
  const { token, } = getUserInfoFn() || {};

  return (
    <>
      <Upload
        listType="picture-card"
        action={`${SERVICE_URL}${action}`}
        accept=".png, .jpg, .jpeg"
        headers={{
          "Authorization": `Bearer ${token}`,
        }}
        {...restProps}
        onPreview={async (file: UploadFile) => {
          if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType)
          }

          setPreviewImage(file.url || (file.preview as string))
          setPreviewOpen(true)
        }}
        onChange={info => {
          if (!info || !Object.keys(info).length) return

          const { file, fileList } = info
          if (isForm) {
            props?.onChange?.(fileList as any)
          }

          if (file?.status === "uploading") return

          setFileList(fileList)
        }}
      >
        {fileList.length >= maxCount ? null : (
          <Space direction="vertical" size={0}>
            <PlusOutlined />
            <div>上传</div>
          </Space>
        )}
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: visible => setPreviewOpen(visible),
            afterOpenChange: visible => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  )
}
