import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { socket } from "../services/socketConfig";
import getMessages from "../services/getMessages";

import { selectMessages } from "../redux/chatSelectors";
import { ADD_MESSAGE } from "../redux/chatSlice";

import handleSubmitMessage from "../utils/handleSubmitMessage";

const Chat = () => {
  const dispatch = useDispatch(),
    messages = useSelector(selectMessages);

  useEffect(() => {
    // Gets saved messages, if any.
    dispatch(getMessages());
    // Gets back the new message sent by the sender.
    socket.on("get_msg", (chat) => {
      console.log("CHAT", chat);
      chat && dispatch(ADD_MESSAGE(chat));
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="chat">
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={(e) => handleSubmitMessage(e)}>
        <input type="text" placeholder="Message" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
