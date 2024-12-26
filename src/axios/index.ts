import axios from "axios";
import { AUTH_CODE, SERVICE_URL, } from "./config";
import { getUserInfoFn, onNavigateToLoginClick, getCurrentLanguageInfoFn, } from "@utils/common";

/** 创建axios实例 */
const $axios = axios.create({
    baseURL: SERVICE_URL,
    timeout: 30 * 1000,
    withCredentials: true,
});

/** 请求拦截器 */
$axios.interceptors.request.use(
    config => {
        const { token, } = getUserInfoFn() || {};
        const headers = config?.headers;
        if(headers && Object.keys(headers).length) {
            if(token) {
                Object.assign(headers, {
                    "Authorization": `Bearer ${token}`,
                })
            }

            Object.assign(headers, {
                terminal: "BOSS",
                lang: getCurrentLanguageInfoFn()?.key || "",
            })
        }

        return config;
    }, 
    error => Promise.reject(error),
);

/** 响应拦截器 */
$axios.interceptors.response.use(
    response => {
        const result = response?.data || {};
        if(result && Object.keys(result).length) {
            const { code, } = result;
            if(code === AUTH_CODE) {
                onNavigateToLoginClick();
            }
        }

        return response || {};
    }, 
    error => Promise.reject(error),
);

export default $axios;