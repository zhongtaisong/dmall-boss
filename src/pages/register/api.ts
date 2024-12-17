import $axios from "@axios"
import { SUCCESS_CODE } from "@axios/config";
import { createLogContentFn } from "@utils/common";
import { message } from "antd";
import type { 
    IRegisterUserParams, 
} from "./types";
import { md5, } from 'js-md5';

/**
 * 注册
 * @param id 
 * @returns 
 */
export const registerUserReq = async (params: Partial<IRegisterUserParams>): Promise<boolean> => {
    let context = false;
    
    try {
        if(params && Object.keys(params).length) {
            Object.assign(params, {
                password: params?.password ? md5(params?.password) : "",
            })
        }
        
        const result = await $axios.post<IResult>(`/user/public/register`, {...params});
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
            path: "registerUserReq",
            error,
        });
    }
    
    return context;
}
