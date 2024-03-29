import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrl from "../constants/apiUrl";
import { SET_MESSAGES } from "../redux/chatSlice";

const getInitialMessages = createAsyncThunk(
  "chat/getInitialChatData",
  async (payload, thunkAPI) => {
    try {
      const res = await axios({
        method: "GET",
        url: `${apiUrl}/chat?roomId=${thunkAPI.getState().chat.roomId}`,
        signal: thunkAPI.signal,
      });

      if (res && res.status === 200) {
        if (res.data.chats) {
          thunkAPI.dispatch(SET_MESSAGES(res.data.chats));
        } else {
          alert("No initial chats were found.");
        }
      }

      return res;
    } catch (error) {
      console.error("getInitialMessages error:", error.message);
    }
  }
);

export default getInitialMessages;
