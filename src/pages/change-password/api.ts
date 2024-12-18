import $axios from "@axios"
import { SUCCESS_CODE } from "@axios/config";
import { createLogContentFn } from "@utils/common";
import { message } from "antd";
import { md5, } from 'js-md5';
import type { 
    IChangeUserPasswordParams, 
} from "./types";

/**
 * 修改用户密码
 * @param id 
 * @returns 
 */
export const changeUserPasswordReq = async (params: Partial<IChangeUserPasswordParams>): Promise<boolean> => {
    let context = false;
    
    try {
        if(params && Object.keys(params).length) {
            Object.assign(params, {
                oldPassword: params?.oldPassword ? md5(params?.oldPassword) : "",
                password: params?.password ? md5(params?.password) : "",
            })
        }

        const result = await $axios.post<IResult>(`/user/changePassword`, {...params});
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
            path: "changeUserPasswordReq",
            error,
        });
    }
    
    return context;
}
