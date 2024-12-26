import i18n from 'i18next';   
import { initReactI18next } from 'react-i18next';
import zh_i18n_boss_json from './language/zh-i18n-boss.json'
import en_i18n_boss_json from './language/en-i18n-boss.json'
import ru_i18n_boss_json from './language/ru-i18n-boss.json'
import { getCurrentLanguageInfoFn } from '@utils/common';
   
// 定义翻译资源   
const resources = {
   zh: {
    translation: {...zh_i18n_boss_json},
   },
   en: {
    translation: {...en_i18n_boss_json},
   },
   ru: {
    translation: {...ru_i18n_boss_json},
   }   
};
   
// 初始化 i18next   
i18n
   .use(initReactI18next)
   .init({
    resources,
    lng: getCurrentLanguageInfoFn()?.key, // 默认语言
    interpolation: {
      escapeValue: false // React 默认已经安全处理
    }
   });
   
export default i18n;
