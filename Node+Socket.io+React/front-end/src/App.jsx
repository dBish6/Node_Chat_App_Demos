import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import socketConfig from "./services/socketConfig";
import getMessages from "./services/getMessages";
import emitMessage from "./services/emitMessage";

import { selectMessages } from "./redux/chatSelectors";

import { socket } from "./services/socketConfig";
import { ADD_MESSAGE } from "./redux/chatSlice";

function App() {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);

  // Sends the new message sent by the sender.
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      dispatch(emitMessage(message));
      setMessage("");
    }
  };

  useEffect(() => {
    // Establishes the connection to the chat socket.
    socketConfig();
    // Gets saved messages, if any.
    dispatch(getMessages());
    // Gets back the new message sent by the sender.
    socket.on("get_msg", (chat) => {
      dispatch(ADD_MESSAGE(chat));
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          placeholder="Message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
