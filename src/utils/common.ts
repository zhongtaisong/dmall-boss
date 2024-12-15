/**
 * 创建日志信息 - 操作
 * @param params 
 * @returns 
 */
export const createLogContentFn = (params: {
    path: string;
    msg?: string;
    error: any;
}) => {
    if(!params || !Object.keys(params).length) return;

    const date = new Date();
    const time = date.toLocaleString();
    const { path, msg, error, } = params;
    if(!path) return;

    console.log(`${ time } --- ${ path } --- ${ msg || "操作失败" }`, { content: error || {}, });
}
