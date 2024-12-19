declare interface IObject {
    [key: string]: any;
}

declare interface IResult<T = any> {
    code: string;
    context: T;
    message: string;
}

declare interface IListResult<T = any> {
    pageNum: number;
    pageSize: number;
    content: Array<T>;
    total: number;
    totalPages: number;
    actions: IDmActions;
}

declare type IDmActions = Array<"add" | "upate" | "delete" | "reset_password">;
