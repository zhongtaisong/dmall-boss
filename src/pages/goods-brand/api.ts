import $axios from "@axios"
import { SUCCESS_CODE } from "@axios/config";
import { createLogContentFn } from "@utils/common";
import { message } from "antd";
import type { IAddGoodsBrandParams, IQueryGoodsBrandListParams, IQueryGoodsBrandListResult, IUpdateGoodsBrandParams, } from "./types";

/**
 * 查询列表
 * @param params 
 * @returns 
 */
export const queryGoodsBrandListReq = async (params: Partial<IQueryGoodsBrandListParams>): Promise<Partial<IQueryGoodsBrandListResult>> => {
    let context = {};
    
    try {
        const result = await $axios.post<IResult>("/goods-brand/list", {
            ...params,
        });
        context = result?.data?.context || {};
    } catch (error) {
        createLogContentFn({
            path: "queryGoodsBrandListReq",
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
export const deleteGoodsBrandReq = async (id: number): Promise<boolean> => {
    let context = false;
    
    try {
        const result = await $axios.delete<IResult>(`/goods-brand/delete/${ id }`);
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
            path: "deleteGoodsBrandReq",
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
export const addGoodsBrandReq = async (params: Partial<IAddGoodsBrandParams>): Promise<boolean> => {
    let context = false;
    
    try {
        const result = await $axios.post<IResult>(`/goods-brand/add`, {...params});
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
            path: "addGoodsBrandReq",
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
export const updateGoodsBrandReq = async (params: Partial<IUpdateGoodsBrandParams>): Promise<boolean> => {
    let context = false;
    
    try {
        const result = await $axios.put<IResult>(`/goods-brand/update`, {...params});
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
            path: "updateGoodsBrandReq",
            error,
        });
    }
    
    return context;
}
