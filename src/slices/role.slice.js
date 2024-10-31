import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: null,
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.user = action.payload;
    },
    clearRole: (state) => {
      state.user = null;
    },
  },
});

export const { setRole, clearRole } = roleSlice.actions;
export default roleSlice.reducer;
