export interface ISliceState {
    dataSource: Array<IRow>;
    total: number;
    dmActions: IDmActions;
};

export interface IRow {
    id: number;
    url: string;
    used: boolean;
    createdAt: string;
};

export type IQueryImageListResult = IListResult<IRow>;
