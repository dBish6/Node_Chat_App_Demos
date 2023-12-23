import { createAsyncThunk } from "@reduxjs/toolkit";
import { socket } from "./socketConfig";
import { SET_ROOM_ID } from "../redux/chatSlice";

const roomConnect = createAsyncThunk(
  "chat/roomConnect",
  async (payload, thunkAPI) => {
    new Promise((resolve, reject) => {
      try {
        const type = payload.type;

        if (!["join", "leave"].includes(type))
          throw Error(
            `joinRoom error:\n Please provide a valid payload for type, ${type} is not accessible to 'join' or 'leave'.`
          );

        type === "join" && thunkAPI.dispatch(SET_ROOM_ID(payload.roomId));
        resolve(
          socket.emit(`${type}_room`, {
            roomId: thunkAPI.getState().chat.roomId,
            user: `User_${socket.id}`,
          })
        );
      } catch (error) {
        console.error(`joinRoom ${type} error:\n`, error.message);
        reject(error);
      }
    });
  }
);

export default roomConnect;
