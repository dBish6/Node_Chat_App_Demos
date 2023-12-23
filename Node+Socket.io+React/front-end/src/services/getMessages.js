import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrl from "../constants/apiUrl";
import { SET_MESSAGES } from "../redux/chatSlice";

const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (payload, thunkAPI) => {
    try {
      const res = await axios({
        method: "GET",
        url: `${apiUrl}/chat?roomId=${thunkAPI.getState().chat.roomId}`,
        signal: thunkAPI.signal,
      });
      console.log("res.data", res.data);

      if (res && res.status === 200) {
        if (res.data.chats) {
          thunkAPI.dispatch(SET_MESSAGES(res.data.chats));
        } else {
          alert("No initial chats were found.");
        }
      }
    } catch (error) {
      console.error("getMessages error:", error.message);
    }
  }
);

export default getMessages;
