import React, { useEffect } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter, Route, Routes, useNavigate } from "react-router"
import App from "./App"
import { store } from "./app/store"
import { ConfigProvider } from "antd"
import zhCN from "antd/locale/zh_CN"
import { ROUTE_LIST, ROUTE_LIST_PUBLIC } from "./router"
import { Helmet } from "react-helmet"
import { eventBus, } from "@utils/event-bus"
import type { IEventBus } from "@utils/event-bus"
import "./index.less"

const container = document.getElementById("root")

const RootComponent: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const onNavigateChange = (data: IEventBus['navigate']) => navigate(data?.to, data?.options);
    eventBus.on("navigate", onNavigateChange);

    return () => {
      eventBus.off('navigate', onNavigateChange);
    };
  }, [navigate]);

  return (
    <Routes>
      {ROUTE_LIST_PUBLIC.map(item => {
        return (
          <Route
            key={item?.path}
            path={item?.path}
            element={
              <div>
                <Helmet>
                  <title>{item?.title}</title>
                </Helmet>

                <item.element />
              </div>
            }
          />
        )
      })}

      <Route path="/" element={<App />}>
        {ROUTE_LIST.map(item => {
          return (
            <Route
              key={item?.path}
              path={item?.path}
              element={
                <div>
                  <Helmet>
                    <title>{item?.title}</title>
                  </Helmet>

                  <div className="dm_main_title">
                    <span>{item?.title}</span>
                  </div>

                  <item.element />
                </div>
              }
            />
          )
        })}
      </Route>
    </Routes>
  )
}

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <ConfigProvider locale={zhCN}>
          <BrowserRouter>
            <RootComponent />
          </BrowserRouter>
        </ConfigProvider>
      </Provider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
