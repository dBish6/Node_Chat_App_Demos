import { createSlice } from "@reduxjs/toolkit";

import emitManageRoom from "../services/emitManageRoom";
import getInitialMessages from "../services/getInitialMessages";
import emitMessage from "../services/emitMessage";
import emitUserTyping from "../services/emitUserTyping";

import history from "../utils/history";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    roomId: sessionStorage.getItem("roomId"),
    userList: { alpha: [], bravo: [] },
    messages: { alpha: [], bravo: [] },
  },
  reducers: {
    SET_ROOM_ID: (state, action) => {
      state.roomId = action.payload;
    },
    SET_USER_LIST: (state, action) => {
      state.userList = action.payload;
    },
    SET_MESSAGES: (state, action) => {
      state.messages[state.roomId] = [
        ...state.messages[state.roomId],
        ...action.payload,
      ];
    },
    ADD_MESSAGE: (state, action) => {
      // FIXME: unshift is bad.
      state.messages[state.roomId].unshift(action.payload);
    },
    CLEAR_MESSAGES: (state) => {
      state.messages = { alpha: [], bravo: [] };
    },
  },
  // TODO: Only log in production.
  extraReducers: (builder) => {
    builder
      .addCase(emitManageRoom.pending, () => {
        console.log("Joining or leaving room...");
      })
      .addCase(emitManageRoom.fulfilled, (state) => {
        console.log(`Room ${state.roomId} joined or left successfully!`);
      })

      .addCase(getInitialMessages.pending, () => {
        console.log("Getting messages...");
      })
      .addCase(getInitialMessages.fulfilled, () => {
        console.log("Messages received!");
      })

      .addCase(emitMessage.pending, () => {
        console.log("Emitted message pending...");
      })
      .addCase(emitMessage.fulfilled, () => {
        console.log("Emitted message fulfilled!");
      })

      .addCase(emitUserTyping.pending, () => {
        console.log("Emitting typing...");
      })
      .addCase(emitUserTyping.fulfilled, () => {
        console.log("Emitting typing fulfilled!");
      })

      // Handles errors across all thunks.
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          const error = action.error;
          if (error.code === "ECONNABORTED" || error.message === "canceled") {
            console.warn("Request was aborted.");
          } else {
            history.push("/error-500");
          }
        }
      );
  },
});

export const {
  SET_ROOM_ID,
  SET_USER_LIST,
  SET_MESSAGES,
  ADD_MESSAGE,
  CLEAR_MESSAGES,
} = chatSlice.actions;

export default chatSlice.reducer;
