import $axios from "@axios"
import { createLogContentFn } from "@utils/common";
import type { 
    IQueryUserInfoResult, 
} from "./types";

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
