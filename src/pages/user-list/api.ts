import $axios from "@axios"
import { SUCCESS_CODE } from "@axios/config";
import { createLogContentFn } from "@utils/common";
import { message } from "antd";
import { md5, } from 'js-md5';
import type { 
    IAddUserParams, IQueryUserListParams, 
    IQueryUserListResult,
    IUpdateUserParams, 
} from "./types";

/**
 * 查询列表
 * @param params 
 * @returns 
 */
export const queryUserListReq = async (params: Partial<IQueryUserListParams>): Promise<Partial<IQueryUserListResult>> => {
    let context = {};
    
    try {
        const result = await $axios.post<IResult>("/user/list", {
            ...params,
        });
        context = result?.data?.context || {};
    } catch (error) {
        createLogContentFn({
            path: "queryUserListReq",
            error,
        });
    }
    
    return context;
}

/**
 * 删除行数据
 * @param id 
 * @returns 
 */
export const deleteUserReq = async (id: number): Promise<boolean> => {
    let context = false;
    
    try {
        const result = await $axios.delete<IResult>(`/user/delete/${ id }`);
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
            path: "deleteUserReq",
            error,
        });
    }
    
    return context;
}

/**
 * 新增
 * @param params 
 * @returns 
 */
export const addUserReq = async (params: Partial<IAddUserParams>): Promise<boolean> => {
    let context = false;
    
    try {
        if(params && Object.keys(params).length) {
            Object.assign(params, {
                password: params?.password ? md5(params?.password) : "",
            })
        }

        const result = await $axios.post<IResult>(`/user/add`, {...params});
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
            path: "addUserReq",
            error,
        });
    }
    
    return context;
}

/**
 * 更新
 * @param id 
 * @returns 
 */
export const updateUserReq = async (params: Partial<IUpdateUserParams>): Promise<boolean> => {
    let context = false;
    
    try {
        const result = await $axios.put<IResult>(`/user/update`, {...params});
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
            path: "updateUserReq",
            error,
        });
    }
    
    return context;
}

/**
 * 重置用户密码
 * @param id 
 * @returns 
 */
export const resetUserPasswordReq = async (params: Partial<IUpdateUserParams>): Promise<string> => {
    let context = "";
    
    try {
        const result = await $axios.post<IResult>(`/user/resetPassword`, {...params});
        context = result?.data?.context || "";
        const isSuccess = result?.data?.code === SUCCESS_CODE;
        const msg = result?.data?.message;
        if(!isSuccess && msg) {
            message.error(msg);
        }
    } catch (error) {
        createLogContentFn({
            path: "resetUserPasswordReq",
            error,
        });
    }
    
    return context;
}
