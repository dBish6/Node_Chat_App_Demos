import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToMessages } from "./services/api";
import { sendAsyncMessage } from "./services/sendMessage";
import { chatMessages } from "./redux/chatSelectors";

function App() {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const messages = useSelector(chatMessages);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      dispatch(sendAsyncMessage(message));
      setMessage("");
    }
  };

  useEffect(() => {
    subscribeToMessages(dispatch);
  }, []);

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
