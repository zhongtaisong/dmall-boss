import $axios from "@axios"
import { createLogContentFn } from "@utils/common";
import type { 
    IQueryUserInfoResult, 
} from "./types";
import { SUCCESS_CODE } from "@axios/config";
import { message } from "antd";

/**
 * 查询登录用户信息
 * @returns 
 */
export const queryUserInfoReq = async (): Promise<Partial<IQueryUserInfoResult>> => {
    let context = {};
    
    try {
        const result = await $axios.get<IResult>(`/user/info`);
        context = result?.data?.context || {};
    } catch (error) {
        createLogContentFn({
            path: "queryUserInfoReq",
            error,
        });
    }
    
    return context;
}

/**
 * 更新登录用户信息
 * @returns 
 */
export const updateInfoReq = async (params: IObject): Promise<boolean> => {
    let context = false;
    
    try {
        const result = await $axios.post<IResult>(`/user/info/update`, {...params});
        context = result?.data?.code === SUCCESS_CODE;

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
            path: "updateInfoReq",
            error,
        });
    }
    
    return context;
}
