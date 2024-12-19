import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "@app/createAppSlice"
import { PAGE_NUM, PAGE_SIZE } from "@axios/config";
import type { ISliceState } from "./types";

const initialState: ISliceState = {
    params: {
        pageNum: PAGE_NUM,
        pageSize: PAGE_SIZE,
    },
    dataSource: [],
    total: 0,
    dmActions: [],
}

export const goodsBrandSlice = createAppSlice({
  name: "goodsBrand",
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
                    state[key] = value;
                }
            }
        });
    }),
  }),
  selectors: {
    getStateFn: (state) => state,
  },
})

export const { 
    onUpdateStateChange,
} = goodsBrandSlice.actions;

export const { getStateFn, } = goodsBrandSlice.selectors;
