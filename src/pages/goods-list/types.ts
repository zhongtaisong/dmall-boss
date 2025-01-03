export interface ISliceState {
    searchParams: IQueryGoodsListParams;
    dataSource: Array<IRow>;
    total: number;
    isGoodsModalVisible: boolean;
    modalInfo: Partial<IRow>;
    dmActions: IDmActions;
};

export type IParams = IQueryGoodsListParams;
export type IRow = IAddGoodsParams & {
    id: number;
};

export type IModalType = "isGoodsModalVisible";

export interface IQueryGoodsListParams {
    pageNum: number;
    pageSize: number;
}
export type IQueryGoodsListResult = IListResult<IRow>;

export interface IAddGoodsParams {
    goods_name: string;
    goods_subtitle: string;
    goods_price: string | number;
    goods_imgs: Array<string>;
}

export interface IUpdateGoodsParams extends IAddGoodsParams {
    id: number;
}
