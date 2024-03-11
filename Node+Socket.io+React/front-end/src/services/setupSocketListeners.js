import { socket } from "./socketConfig";
import { store } from "../redux/store";
import { ADD_MESSAGE } from "../redux/chatSlice";

const setupSocketListeners = (setUsersTyping) => {
  // Listens for user joined or left messages and or new chat messages.
  try {
    socket.on("get_msg", (message) => {
      store.dispatch(ADD_MESSAGE(message));
      // TODO: Play sound.
    });
  } catch (error) {
    console.error("get_msg listener error:\n", error.message);
  }

  // Listens for users that are typing.
  try {
    socket.on("user_typing", (data) => {
      data.isTyping
        ? setUsersTyping((prev) => new Set([...prev, data.user]))
        : setUsersTyping(
            (prev) => new Set([...prev].filter((user) => user !== data.user))
          );
    });
  } catch (error) {
    console.error("user_typing listener error:\n", error.message);
  }
};

export default setupSocketListeners;
