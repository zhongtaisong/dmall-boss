import type React from "react"
import { Avatar, Dropdown, Layout, Menu, Space, theme } from "antd"
import { LANGUAGE_LIST, MENU_LIST } from "@utils/config"
import { Outlet, useLocation } from "react-router"
import { useNavigate } from "react-router"
import { DownOutlined, UserOutlined } from "@ant-design/icons"
import logo_png from "@assets/imgs/logo.png"
import {
  getCurrentLanguageInfoFn,
  getUserInfoFn,
  onEmitLogoutClick,
} from "@utils/common"
import type { IUserInfo } from "@utils/common"
import "./App.less"
import { useEffect, useMemo, useRef, useState } from "react"
import { queryUserInfoReq } from "@pages/home/api"
import { setItem } from "@analytics/storage-utils"
import { cache } from "@utils/cache"
import { eventBus } from "@utils/event-bus"
import { useTranslation } from "react-i18next"
import lodash from "lodash"

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const items = useMemo(() => {
    const list = [{ key: "1", label: t("退出登录") }]

    if (!["/change-password"].includes(location?.pathname)) {
      list.unshift({
        key: "0",
        label: t("修改密码"),
      })
    }

    return list
  }, [location?.pathname])
  const isUseEffect = useRef(false)
  const [userInfo, setUserInfo] = useState<Partial<IUserInfo>>({})
  const [menuItems, setMenuItems] = useState<any>([])
  const [languageInfo, setLanguageInfo] = useState(getCurrentLanguageInfoFn())

  useEffect(() => {
    if (isUseEffect?.current) return

    isUseEffect.current = true

    /** 查询登录用户信息 - 操作 */
    queryUserInfoFn()
  }, [location.pathname])

  useEffect(() => {
    const onEventBusChange = () => {
      /** 查询登录用户信息 - 操作 */
      queryUserInfoFn()
    }
    eventBus.on("queryUserInfo", onEventBusChange)

    return () => {
      eventBus.off("queryUserInfo", onEventBusChange)
    }
  }, [])

  /**
   * 查询登录用户信息 - 操作
   * @returns
   */
  const queryUserInfoFn = async () => {
    const result = await queryUserInfoReq()
    const info = getUserInfoFn()
    const user_info = {
      ...info,
      ...result,
    }
    setItem(cache.LOGIN_INFO, user_info)
    setUserInfo(user_info)

    let menuItems_new = lodash.cloneDeep(MENU_LIST)
    if (user_info?.role !== "0") {
      menuItems_new = menuItems_new.filter(
        item => !["/i18n"].includes(item?.key),
      )
    }

    if (Array.isArray(menuItems_new) && menuItems_new?.length) {
      menuItems_new.forEach(item => {
        if (item && Object.keys(item).length) {
          Object.assign(item, {
            label: t(item?.label),
          })
        }
      })
    }
    setMenuItems(menuItems_new)
    isUseEffect.current = false
  }

  return (
    <div className="dmall_app">
      <Layout>
        <Layout.Sider breakpoint="lg" collapsedWidth="0">
          <div className="dmall_app__logo">
            <img src={logo_png} alt="" />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location?.pathname].filter(Boolean)}
            items={menuItems}
            onSelect={info => {
              if (!info?.key) return

              navigate(info?.key)
            }}
          />
        </Layout.Sider>

        <Layout>
          <Layout.Header
            style={{ background: colorBgContainer }}
            className="dmall_app__header"
          >
            <div className="dmall_app__header--left"></div>
            <Space className="dmall_app__header--right" size={32}>
              <Dropdown
                menu={{
                  items: LANGUAGE_LIST,
                  onClick: info => {
                    const key = info?.key
                    if (!key || languageInfo?.key === key) return

                    const languageInfo_new =
                      LANGUAGE_LIST?.find(item => item?.key === key) || {}
                    setItem(cache.LANGUAGE_INFO, languageInfo_new)
                    i18n.changeLanguage(key)
                    setLanguageInfo(languageInfo_new)
                    queryUserInfoFn()
                    eventBus.emit("onLanguageChange", languageInfo_new)
                  },
                }}
                arrow
                placement="topRight"
              >
                <Space className="dmall_app__header--right__info">
                  <span>{languageInfo?.label}</span>

                  <DownOutlined style={{ fontSize: 12 }} />
                </Space>
              </Dropdown>

              <Dropdown
                menu={{
                  items,
                  onClick: info => {
                    const key = info?.key
                    if (!key) return

                    switch (key) {
                      case "0":
                        navigate("/change-password")
                        return
                      case "1":
                        onEmitLogoutClick()
                        return
                    }
                  },
                }}
                arrow
                placement="topRight"
              >
                <Space className="dmall_app__header--right__info">
                  {userInfo?.avatar ? (
                    <Avatar src={<img src={userInfo?.avatar} alt="avatar" />} />
                  ) : (
                    <Avatar icon={<UserOutlined />} />
                  )}

                  <span>{userInfo?.nickname || userInfo?.phone}</span>

                  <DownOutlined style={{ fontSize: 12 }} />
                </Space>
              </Dropdown>
            </Space>
          </Layout.Header>

          <Layout.Content
            className="dmall_app__content"
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default App
