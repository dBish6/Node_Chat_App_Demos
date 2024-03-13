import { delay } from "async-delay-callback";
import { store } from "../redux/store";
import emitMessage from "../services/emitMessage";
import emitUserTyping from "../services/emitUserTyping";

export default async (e) => {
  e.preventDefault();
  let input = e.target.querySelector("input");

  if (input.value.trim() !== "") {
    await store.dispatch(emitMessage(input.value));
    // Keeps the scroll to the bottom if you send a message.
    const scrollAreaInner = document.querySelector(
      ".chatScroll .rt-ScrollAreaViewport"
    );
    scrollAreaInner.scrollTop = scrollAreaInner.scrollHeight;
    // To stop the typing indicator and to clear the input.
    input.value = "";
    delay(850, () => store.dispatch(emitUserTyping(input.value)));
  }
};
