export interface ISliceState {
    params: IQueryGoodsBrandListParams;
    dataSource: Array<IRow>;
    total: number;
};

export type IParams = IQueryGoodsBrandListParams;
export type IRow = {
    id: number;
};

export interface IQueryGoodsBrandListParams {
    pageNum: number;
    pageSize: number;
}
export type IQueryGoodsBrandListResult = IListResult<IRow>;

export interface IAddGoodsBrandParams {
    brand_name: string;
}

export interface IUpdateGoodsBrandParams {
    id: number;
    brand_name: string;
}
