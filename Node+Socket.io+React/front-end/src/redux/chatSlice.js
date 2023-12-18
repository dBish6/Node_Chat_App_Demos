import { createSlice } from "@reduxjs/toolkit";
import getMessages from "../services/getMessages";
import emitMessage from "../services/emitMessage";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    roomId: null,
  },
  reducers: {
    SET_MESSAGES: (state, action) => {
      state.messages = [...action.payload];
    },
    ADD_MESSAGE: (state, action) => {
      state.messages = [action.payload, ...state.messages];
    },
    SET_ROOM_ID: (state, action) => {
      state.roomId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMessages.pending, (state) => {
      console.log("Getting messages...");
    });
    builder.addCase(getMessages.fulfilled, (state) => {
      console.log("Messages received!");
    });
    builder.addCase(getMessages.rejected, (state, action) => {
      state.persisterLoading.patch = false;
      console.error("getMessages error:\n", action.error.message);
    });

    builder.addCase(emitMessage.pending, (state) => {
      console.log("Emitted message pending...");
    });
    builder.addCase(emitMessage.fulfilled, (state) => {
      console.log("Emitted message fulfilled!");
    });
    builder.addCase(emitMessage.rejected, (state, action) => {
      state.persisterLoading.patch = false;
      console.error("emitMessage error:\n", action.error.message);
    });
  },
});

export const { SET_MESSAGES, ADD_MESSAGE, SET_ROOM_ID } = chatSlice.actions;

export default chatSlice.reducer;
