import $axios from "@axios"
import { createLogContentFn } from "@utils/common";
import type { 
    IQueryImageListResult,
} from "./types";

/**
 * 查询列表
 * @returns 
 */
export const queryImageListReq = async (): Promise<IQueryImageListResult> => {
    let context = [];
    
    try {
        const result = await $axios.post<IResult>("/image/list/all");
        context = result?.data?.context || [];
    } catch (error) {
        createLogContentFn({
            path: "queryImageListReq",
            error,
        });
    }
    
    return context;
}
