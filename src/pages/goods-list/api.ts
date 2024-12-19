import $axios from "@axios"
import { SUCCESS_CODE } from "@axios/config";
import { createLogContentFn } from "@utils/common";
import { message } from "antd";
import type { 
    IAddGoodsParams, IQueryGoodsListParams, 
    IQueryGoodsListResult,
    IUpdateGoodsParams, 
} from "./types";

/**
 * 查询列表
 * @param params 
 * @returns 
 */
export const queryGoodsListReq = async (params: Partial<IQueryGoodsListParams>): Promise<Partial<IQueryGoodsListResult>> => {
    let context = {};
    
    try {
        const result = await $axios.post<IResult>("/goods/list", {
            ...params,
        });
        context = result?.data?.context || {};
    } catch (error) {
        createLogContentFn({
            path: "queryGoodsListReq",
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
export const deleteGoodsReq = async (id: number): Promise<boolean> => {
    let context = false;
    
    try {
        const result = await $axios.delete<IResult>(`/goods/delete/${ id }`);
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
            path: "deleteGoodsReq",
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
export const addGoodsReq = async (params: Partial<IAddGoodsParams>): Promise<boolean> => {
    let context = false;
    
    try {
        const result = await $axios.post<IResult>(`/goods/add`, {...params});
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
            path: "addGoodsReq",
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
export const updateGoodsReq = async (params: Partial<IUpdateGoodsParams>): Promise<boolean> => {
    let context = false;
    
    try {
        const result = await $axios.put<IResult>(`/goods/update`, {...params});
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
            path: "updateGoodsReq",
            error,
        });
    }
    
    return context;
}
