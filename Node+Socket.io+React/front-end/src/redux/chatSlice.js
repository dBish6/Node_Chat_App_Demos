import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
  },
});

export const { addMessage } = chatSlice.actions;

export default chatSlice.reducer;
