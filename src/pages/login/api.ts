import $axios from "@axios"
import { SUCCESS_CODE } from "@axios/config";
import { createLogContentFn } from "@utils/common";
import { message } from "antd";
import type { 
    ILoginUserParams, 
} from "./types";
import { md5, } from 'js-md5';
import { setItem } from '@analytics/storage-utils'
import { cache } from "@utils/cache";

/**
 * 登录
 * @param id 
 * @returns 
 */
export const loginUserReq = async (params: Partial<ILoginUserParams>): Promise<boolean> => {
    let context = false;
    
    try {
        if(params && Object.keys(params).length) {
            Object.assign(params, {
                password: params?.password ? md5(params?.password) : "",
            })
        }
        
        const result = await $axios.post<IResult>(`/user/public/login`, {...params});
        context = result?.data?.code === SUCCESS_CODE;

        setItem(
            cache.LOGIN_INFO, 
            result?.data?.context || {}, 
            { storage: 'localStorage', },
        );

        const msg = result?.data?.message;
        if(msg) {
            if(context) {
                message.success(msg);
            }else {
                message.error(msg);
            }
        }
    } catch (error) {
        createLogContentFn({
            path: "loginUserReq",
            error,
        });
    }
    
    return context;
}
