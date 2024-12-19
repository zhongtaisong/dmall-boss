import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "@app/createAppSlice"
import type { ISliceState } from "./types";

const initialState: ISliceState = {
}

export const loginSlice = createAppSlice({
  name: "login",
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
  }),
  selectors: {
    getStateFn: (state) => state,
  },
})

export const { 
    onUpdateStateChange,
} = loginSlice.actions;

export const { getStateFn, } = loginSlice.selectors;
