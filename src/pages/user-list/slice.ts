import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "@app/createAppSlice"
import { PAGE_NUM, PAGE_SIZE } from "@axios/config";
import type { IModalType, ISliceState } from "./types";

const initialState: ISliceState = {
    searchParams: {
        pageNum: PAGE_NUM,
        pageSize: PAGE_SIZE,
    },
    dataSource: [],
    total: 0,
    isVisible: false,
    modalInfo: {},
}

export const userListSlice = createAppSlice({
  name: "userList",
  initialState,
  reducers: create => ({
    onUpdateStateChange: create.reducer((state, action: PayloadAction<Array<{
        key: keyof ISliceState;
        value: any;
    }>>) => {
        const payload = action?.payload || [];
        if(!Array.isArray(payload) || !payload.length) return;

        payload.forEach(item => {
            if(item && Object.keys(item).length) {
                const { key, value, } = item;
                if(key) {
                    state[key] = value as never;
                }
            }
        });
    }),
    onToggleModalChange: create.reducer((state, action: PayloadAction<{
        key: IModalType;
        value: boolean;
        params?: IObject;
    }>) => {
        const { key, value, params, } = action?.payload || {};
        if(!key) return;

        state[key] = Boolean(value);
        state.modalInfo = params || {};
    }),
  }),
  selectors: {
    getStateFn: (state) => state,
  },
})

export const { 
    onUpdateStateChange, onToggleModalChange,
} = userListSlice.actions;

export const { getStateFn, } = userListSlice.selectors;
