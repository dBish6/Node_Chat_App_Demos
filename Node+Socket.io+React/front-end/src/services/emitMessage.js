import { createAsyncThunk } from "@reduxjs/toolkit";
import { socket } from "./socketConfig";

// Thunk to send a message.
const emitMessage = createAsyncThunk(
  "chat/emitMessage",
  async (msg, thunkAPI) => {
    new Promise((resolve, reject) => {
      try {
        resolve(
          socket.emit("msg", {
            user: `User_${socket.id}`,
            msg,
            roomId: thunkAPI.getState().chat.roomId,
          })
        );
      } catch (error) {
        console.error("emitMessage error:\n", error.message);
        reject(error);
      }
    });
  }
);

export default emitMessage;
