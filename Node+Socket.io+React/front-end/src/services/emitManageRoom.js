import { createAsyncThunk } from "@reduxjs/toolkit";
import { socket } from "./socketConfig";
import { SET_ROOM_ID, ADD_MESSAGE } from "../redux/chatSlice";
import history from "../utils/history";

const emitManageRoom = createAsyncThunk(
  "chat/emitManageRoom",
  async (payload, thunkAPI) => {
    try {
      return new Promise((resolve, reject) => {
        const { type, roomId } = payload;

        if (!["join", "leave"].includes(type))
          throw Error(
            `joinRoom error:\n Please provide a valid payload for type, ${type} is not accessible to 'join' or 'leave'.`
          );

        socket.emit(
          "manage_room",
          {
            userId: socket.id,
            roomId,
            user: `User_${socket.id}`,
            type,
          },
          (error, res) => {
            if (error) {
              console.error("emitManageRoom server res error:\n", error);
              reject(error);
            } else {
              if (res && res.message) {
                if (type === "join") {
                  thunkAPI.dispatch(SET_ROOM_ID(roomId));
                  history.push(`/rooms/${roomId}`);
                } else {
                  thunkAPI.dispatch(SET_ROOM_ID(null));
                  history.push("/home");
                }
                type !== "leave" && thunkAPI.dispatch(ADD_MESSAGE(res)); // Just so that the current user can see that they joined the room since the get_msg isn't listening at this point.
              }
              resolve();
            }
          }
        );
      });
    } catch (error) {
      console.error(`emitManageRoom error:\n`, error.message);
      reject(error);
    }
  }
);

export default emitManageRoom;
