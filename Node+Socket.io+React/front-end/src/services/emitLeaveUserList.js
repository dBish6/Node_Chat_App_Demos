import { createAsyncThunk } from "@reduxjs/toolkit";
import { socket } from "./socketConfig";

// Thunk to remove the user from the joined user list.
const emitLeaveUserList = createAsyncThunk(
  "chat/emitLeaveUserList",
  async (payload, thunkAPI) => {
    try {
      return new Promise((resolve, reject) =>
        socket.emit(
          "update_user_list",
          {
            userId: socket.id,
            roomId: thunkAPI.getState().chat.roomId,
            username: `User_${socket.id}`,
            type: "leave",
          },
          (error, res) => {
            if (error) {
              console.error("emitLeaveUserList server res error:\n", error);
              reject(error);
            } else {
              resolve(res);
            }
          }
        )
      );
    } catch (error) {
      console.error(`emitLeaveUserList error:\n`, error.message);
      reject(error);
    }
  }
);

export default emitLeaveUserList;
