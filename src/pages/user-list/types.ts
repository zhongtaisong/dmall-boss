export interface ISliceState {
    searchParams: IQueryUserListParams;
    dataSource: Array<IRow>;
    total: number;
    isVisible: boolean;
    modalInfo: Partial<IRow>;
    dmActions: IDmActions;
};

export type IParams = IQueryUserListParams;
export type IRow = IAddUserParams & {
    id: number;
    isAction: boolean;
};

export type IModalType = "isVisible";

export interface IQueryUserListParams {
    pageNum: number;
    pageSize: number;
    phone?: string;
    role?: "0" | "1" | "2";
}
export type IQueryUserListResult = IListResult<IRow>;

export interface IAddUserParams {
    phone: string;
    password: string;
    nickname: string;
    avatar: Array<string>;
    role: "0" | "1" | "2";
}

export interface IUpdateUserParams extends IAddUserParams {
    id: number;
}
