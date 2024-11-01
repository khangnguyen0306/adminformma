import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: null,
};

const OderSlice = createSlice({
  name: "Oder",
  initialState,
  reducers: {
    setOder: (state, action) => {
      state.user = action.payload;
    },
    clearOder: (state) => {
      state.user = null;
    },
  },
});

export const { setOder, clearOder } = OderSlice.actions;
export default OderSlice.reducer;

