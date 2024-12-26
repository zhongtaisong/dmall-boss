import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router";
import App from "./App";
import { store } from "./app/store";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import ruRu from "antd/locale/ru_RU";
import { ROUTE_LIST, ROUTE_LIST_PUBLIC } from "./router";
import { Helmet } from "react-helmet";
import { eventBus } from "@utils/event-bus";
import type { IEventBus } from "@utils/event-bus";
import "./index.less";
import { getCurrentLanguageInfoFn } from "@utils/common";
import "./i18n";
import { useTranslation } from "react-i18next";

const container = document.getElementById("root");

const RootComponent: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const onNavigateChange = (data: IEventBus["navigate"]) =>
      navigate(data?.to, data?.options);
    eventBus.on("navigate", onNavigateChange);

    return () => {
      eventBus.off("navigate", onNavigateChange);
    };
  }, [navigate]);
  const { t } = useTranslation();

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
                  <title>{t(item?.title)}</title>
                </Helmet>

                <item.element />
              </div>
            }
          />
        );
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
                    <title>{t(item?.title)}</title>
                  </Helmet>

                  <div className="dm_main_title">
                    <span>{t(item?.title)}</span>
                  </div>

                  <item.element />
                </div>
              }
            />
          );
        })}
      </Route>
    </Routes>
  );
};

const MainComponent: React.FC = () => {
  const [languageInfo, setLanguageInfo] = useState(getCurrentLanguageInfoFn());

  useEffect(() => {
    const onLanguageChange = (data: IEventBus["onLanguageChange"]) => {
      if (!data?.key) return;

      setLanguageInfo(data);
    };
    eventBus.on("onLanguageChange", onLanguageChange);

    return () => {
      eventBus.off("onLanguageChange", onLanguageChange);
    };
  }, []);

  const getLocale = useMemo(() => {
    switch (languageInfo?.key) {
      case "zh":
        return zhCN;
      case "en":
        return enUS;
      case "ru":
        return ruRu;
      default:
        return zhCN;
    }
  }, [languageInfo]);

  return (
    <ConfigProvider locale={getLocale}>
      <BrowserRouter>
        <RootComponent />
      </BrowserRouter>
    </ConfigProvider>
  );
};

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <MainComponent />
      </Provider>
    </React.StrictMode>,
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  );
}
