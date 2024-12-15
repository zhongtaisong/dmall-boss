import type React from "react"
import { Layout, Menu, theme } from "antd"
import { MENU_LIST } from "@utils/config"
import { Route, Routes, useLocation } from "react-router"
import { ROUTE_LIST } from "./router"
import { useNavigate } from "react-router"
import logo_png from "@assets/imgs/logo.png"
import "./App.less"

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const navigate = useNavigate()
  const location = useLocation();

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
            selectedKeys={ [location?.pathname].filter(Boolean) }
            items={MENU_LIST}
            onSelect={info => {
              if (!info?.key) return

              navigate(info?.key)
            }}
          />
        </Layout.Sider>

        <Layout>
          <Layout.Header style={{ padding: 0, background: colorBgContainer }} />

          <Layout.Content
            className="dmall_app__content"
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              {ROUTE_LIST.map(item => {
                return (
                  <Route
                    key={item?.path}
                    path={item?.path}
                    element={<item.element />}
                  />
                )
              })}
            </Routes>
          </Layout.Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default App
