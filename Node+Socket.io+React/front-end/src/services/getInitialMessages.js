import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrl from "../constants/apiUrl";
import history from "../utils/history";
import { SET_MESSAGES } from "../redux/chatSlice";

const getInitialMessages = createAsyncThunk(
  "chat/getInitialMessages",
  async (payload, thunkAPI) => {
    // console.log(
    //   "thunkAPI.getState().chat.roomId",
    //   thunkAPI.getState().chat.roomId
    // );
    // TODO:
    if (!thunkAPI.getState().chat.roomId) {
      history.push("/home");
      alert(
        "The roomId wasn't set, probably because you refreshed the page. I am working on persisting the roomId."
      );
    }

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
