import WujieReact from "wujie-react";
import "./index.less"

const I18nPage: React.FC = () => {
  return (
    <div className="dm_i18n_page">
      <WujieReact
         width="100%"
         height="100%"
         name="dm_i18n_page"
         url="http://localhost:3000"
        /** 子应用保活模式，state不会丢失 */
        alive={ true }
        props={{
          terminal: "i18n-boss",
        }}
      ></WujieReact>
    </div>
  )
}

export default I18nPage
