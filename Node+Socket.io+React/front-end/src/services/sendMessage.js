import { sendMessage as sendSocketMessage, subscribeToMessages } from "./api";
import { addMessage } from "../redux/chatSlice";

// Thunk to send a message.
export const sendAsyncMessage = (message) => async (dispatch) => {
  try {
    sendSocketMessage(message);
    dispatch(addMessage({ name: "User", message }));
  } catch (error) {
    console.error("Error sending message:\n", error);
  }
};

export const subscribeToMessageUpdates = () => (dispatch) => {
  subscribeToMessages((updatedMessages) => {
    dispatch(addMessage(updatedMessages));
  });
};
