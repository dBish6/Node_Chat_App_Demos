import { createSlice } from "@reduxjs/toolkit";
import emitManageRoom from "../services/emitManageRoom";
import getInitialMessages from "../services/getInitialMessages";
import emitMessage from "../services/emitMessage";
import emitUserTyping from "../services/emitUserTyping";
import history from "../utils/history";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    roomId: null,
    messages: { alpha: [], bravo: [] },
  },
  reducers: {
    SET_ROOM_ID: (state, action) => {
      state.roomId = action.payload;
    },
    SET_MESSAGES: (state, action) => {
      state.messages[state.roomId] = [
        ...state.messages[state.roomId],
        ...action.payload,
      ];
    },
    ADD_MESSAGE: (state, action) => {
      state.messages[state.roomId].unshift(action.payload);
    },
  },
  // TODO: Only log in production.
  extraReducers: (builder) => {
    builder
      .addCase(emitManageRoom.pending, (state) => {
        console.log("Joining room...");
      })
      .addCase(emitManageRoom.fulfilled, (state) => {
        console.log(`Room ${state.roomId} joined successfully!`);
      })

      .addCase(getInitialMessages.pending, (state) => {
        console.log("Getting messages...");
      })
      .addCase(getInitialMessages.fulfilled, (state) => {
        console.log("Messages received!");
      })

      .addCase(emitMessage.pending, (state) => {
        console.log("Emitted message pending...");
      })
      .addCase(emitMessage.fulfilled, (state) => {
        console.log("Emitted message fulfilled!");
      })

      .addCase(emitUserTyping.pending, (state) => {
        console.log("Emitting typing...");
      })
      .addCase(emitUserTyping.fulfilled, (state) => {
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

export const { SET_ROOM_ID, SET_MESSAGES, ADD_MESSAGE } = chatSlice.actions;

export default chatSlice.reducer;
