import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.user = action.payload;
    },
    clearOrder: (state) => {
      state.user = null;
    },
  },
});

export const { setOrder, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
