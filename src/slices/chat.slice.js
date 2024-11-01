import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action) => {
      state.chat = action.payload;
    },
    clearChat: (state) => {
      state.chat = null;
    },
  },
});

export const { setChat, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
