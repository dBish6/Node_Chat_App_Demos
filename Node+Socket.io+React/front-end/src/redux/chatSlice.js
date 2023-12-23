import { createSlice } from "@reduxjs/toolkit";
import roomConnect from "../services/roomConnect";
import getMessages from "../services/getMessages";
import emitMessage from "../services/emitMessage";
import history from "../utils/history";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: { alpha: [], bravo: [] },
    roomId: null,
  },
  reducers: {
    SET_MESSAGES: (state, action) => {
      state.messages[state.roomId] = action.payload;
    },
    ADD_MESSAGE: (state, action) => {
      state.messages[state.roomId].unshift(action.payload);
    },
    SET_ROOM_ID: (state, action) => {
      state.roomId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(roomConnect.pending, (state) => {
        console.log("Joining room...");
      })
      .addCase(roomConnect.fulfilled, (state) => {
        console.log(`Room ${state.roomId} joined successfully!`);
      })

      .addCase(getMessages.pending, (state) => {
        console.log("Getting messages...");
      })
      .addCase(getMessages.fulfilled, (state) => {
        console.log("Messages received!");
      })

      .addCase(emitMessage.pending, (state) => {
        console.log("Emitted message pending...");
      })
      .addCase(emitMessage.fulfilled, (state) => {
        console.log("Emitted message fulfilled!");
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

export const { SET_MESSAGES, ADD_MESSAGE, SET_ROOM_ID } = chatSlice.actions;

export default chatSlice.reducer;
