export interface ISliceState {
    searchParams: IQueryUserListParams;
    dataSource: Array<IRow>;
    total: number;
    isVisible: boolean;
    modalInfo: Partial<IRow>;
};

export type IParams = IQueryUserListParams;
export type IRow = IAddUserParams & {
    id: number;
};

export type IModalType = "isVisible";

export interface IQueryUserListParams {
    pageNum: number;
    pageSize: number;
}
export type IQueryUserListResult = IListResult<IRow>;

export interface IAddUserParams {
    phone: string;
    password: string;
    nickname: string;
    avatar: Array<string>;
}

export interface IUpdateUserParams extends IAddUserParams {
    id: number;
}
