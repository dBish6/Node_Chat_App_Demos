import { createAsyncThunk } from "@reduxjs/toolkit";
import { socket } from "./socketConfig";

// Thunk to send a message.
const emitMessage = createAsyncThunk(
  "chat/emitMessage",
  async (msg, thunkAPI) => {
    try {
      return new Promise((resolve) =>
        socket.emit(
          "msg",
          {
            userId: socket.id,
            user: `User_${socket.id}`,
            msg,
            roomId: thunkAPI.getState().chat.roomId,
          },
          (error, res) => {
            if (error) {
              console.error("emitMessage server res error:\n", error);
              reject(error);
            } else {
              resolve(res);
            }
          }
        )
      );
    } catch (error) {
      console.error("emitMessage error:\n", error.message);
      reject(error);
    }
  }
);

export default emitMessage;
