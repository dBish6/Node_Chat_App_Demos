import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrl from "../constants/apiUrl";
import { SET_MESSAGES } from "../redux/chatSlice";

const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (payload, thunkAPI) => {
    const abortController = new AbortController();

    try {
      const res = await axios({
        method: "GET",
        url: `${apiUrl}/chat?roomId=${thunkAPI.getState().chat.roomId}`,
        signal: abortController.signal,
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
      if (error.code === "ECONNABORTED" || error.message === "canceled") {
        console.warn("Request was aborted.");
      } else {
        console.error(error);
        // navigate("/error500");
      }
      abortController.abort();
    }
  }
);

export default getMessages;
