import { useEffect, useRef } from "react";
import {
  Image,
  Empty,
} from "antd";
import {
  queryImageListReq,
} from "./api";
import { getStateFn, onUpdateStateChange } from "./slice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { useTranslation } from "react-i18next";
import "./index.less";

const ImageList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { dataSource, total, } = useAppSelector(getStateFn);
  const isUseEffect = useRef(false);

  useEffect(() => {
    if (isUseEffect?.current) return;

    isUseEffect.current = true;

    /** 查询列表 - 操作 */
    queryImageListReqFn();
  });

  /**
   * 查询列表 - 操作
   * @param params
   */
  const queryImageListReqFn = async () => {
    const result = await queryImageListReq();
    const list = result?.content || [];

    dispatch(
      onUpdateStateChange([
        { key: "dataSource", value: list },
        { key: "total", value: result?.total ?? 0 },
        { key: "dmActions", value: result?.actions || [] },
      ]),
    );
  };
  
  if(!Array.isArray(dataSource) || !dataSource.length) {
    return (
      <Empty 
        image={Empty.PRESENTED_IMAGE_SIMPLE} 
        description={t("暂无数据")} 
      />
    );
  }
  
  return (
    <div className="dm_image_list">
      <div className="dm_image_list__title">
        <span>{ t(`共 {{total}} 条`, {
          total,
        })}</span>
      </div>

      <ul className="dm_image_list__body">
        {
          dataSource.map((item) => {
            if(!item.url) return null;

            return (
              <li 
                key={item.id}
                className="dm_image_list__body--item"
              >
                <Image src={item.url} width="100%" />
                <ul>
                  <li>
                    <div>{ t(`使用状态`) }：</div>
                    <span 
                      style={{ 
                        fontWeight: "bold", 
                        color: item?.used ? "green" : "red",
                      }}
                    >{ item?.used ? t(`使用中`) : t(`未使用`) }</span>
                  </li>

                  <li>
                    <div>{ t(`上传时间`) }：</div>
                    <span>{ item?.createdAt || "-" }</span>
                  </li>
                </ul>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default ImageList;
