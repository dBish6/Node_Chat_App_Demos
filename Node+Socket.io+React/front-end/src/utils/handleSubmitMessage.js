import { store } from "../redux/store";
import emitMessage from "../services/emitMessage";

export default (e) => {
  e.preventDefault();
  console.log("e.target", e.target);

  const message = e.target.children[0].value;
  if (message.trim() !== "") {
    store.dispatch(emitMessage(message));
  }

  e.target.reset();
};
