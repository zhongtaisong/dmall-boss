import type React from "react"
import { Avatar, Dropdown, Layout, Menu, Space, theme } from "antd"
import { MENU_LIST } from "@utils/config"
import { Outlet, useLocation } from "react-router"
import { useNavigate } from "react-router"
import { DownOutlined, UserOutlined } from "@ant-design/icons"
import logo_png from "@assets/imgs/logo.png"
import { getUserInfoFn, onEmitLogoutClick } from "@utils/common"
import "./App.less"
import { useMemo } from "react"

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const navigate = useNavigate()
  const location = useLocation()
  const user_info = getUserInfoFn()
  const items = useMemo(() => {
    const list = [
      { key: "1", label: "退出登录" },
    ];

    if(!["/change-password"].includes(location?.pathname)) {
      list.unshift({
        key: "0",
        label: "修改密码",
      });
    }

    return list;
  }, [location?.pathname])

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
            items={MENU_LIST}
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
            <div className="dmall_app__header--right">
              <Dropdown
                menu={{
                  items,
                  onClick: (info) => {
                    const key = info?.key
                    if (!key) return

                    switch (key) {
                      case "0":
                        navigate("/change-password")
                        return
                      case "1":
                        onEmitLogoutClick();
                        return
                    }
                  },
                }}
                arrow
                placement="topRight"
              >
                <Space className="dmall_app__header--right__info">
                  {user_info?.avatar ? (
                    <Avatar
                      src={<img src={user_info?.avatar} alt="avatar" />}
                    />
                  ) : (
                    <Avatar icon={<UserOutlined />} />
                  )}

                  <span>{user_info?.nickname || user_info?.phone}</span>

                  <DownOutlined style={{ fontSize: 12 }} />
                </Space>
              </Dropdown>
            </div>
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
