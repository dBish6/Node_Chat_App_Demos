import { createAsyncThunk } from "@reduxjs/toolkit";
import { socket } from "./socketConfig";

// Thunk to notify that the user typing.
const emitUserTyping = createAsyncThunk(
  "chat/emitUserTyping",
  async (text, thunkAPI) => {
    try {
      return new Promise((resolve, reject) =>
        socket.emit(
          "typing",
          {
            username: `User_${socket.id}`,
            roomId: thunkAPI.getState().chat.roomId,
            isTyping: text.length ? true : false,
          },
          (error, res) => {
            if (error) {
              console.error("emitUserTyping server res error:\n", error);
              reject(error);
            } else {
              resolve(res);
            }
          }
        )
      );
    } catch (error) {
      console.error("emitUserTyping error:\n", error.message);
      reject(error);
    }
  }
);

export default emitUserTyping;
