import { createAsyncThunk } from "@reduxjs/toolkit";
import { socket } from "./socketConfig";
import { SET_ROOM_ID, SET_USER_LIST, ADD_MESSAGE } from "../redux/chatSlice";
import emitLeaveUserList from "./emitLeaveUserList";
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
              if (res) {
                const dispatch = thunkAPI.dispatch;

                if (type === "join") {
                  if (Object.keys(res).length === 2) {
                    dispatch(SET_ROOM_ID(roomId));
                    dispatch(SET_USER_LIST(res.userList));
                    history.push(`/rooms/${roomId}`);

                    thunkAPI.dispatch(ADD_MESSAGE(res.message)); // Just so that the current user can see that they joined the room since the get_msg isn't listening at this point.
                  } else {
                    throw Error(
                      "Invalid response was given in emitManageRoom."
                    );
                  }
                }

                if (type === "leave") {
                  // TODO: Should have a loading screen for this.
                  dispatch(emitLeaveUserList()).then(() => {
                    dispatch(SET_ROOM_ID(null));
                    history.push("/home");
                  });
                }
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
