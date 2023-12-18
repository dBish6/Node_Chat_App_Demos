import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { socket } from "../services/socketConfig";

import { SET_ROOM_ID } from "../redux/chatSlice";

const Home = () => {
  const dispatch = useDispatch(),
    navigate = useNavigate();

  const handleJoinRoom = (roomId) => {
    socket.emit("join_room", { roomId, user: `User_${socket.id}` });
    dispatch(SET_ROOM_ID(roomId));
    navigate(`/rooms/${roomId.toLowerCase()}`);
  };

  return (
    <div>
      <h2>Start By Joining a Room</h2>
      <button onClick={(e) => handleJoinRoom(e.target.innerText)}>Alpha</button>
      <button onClick={() => alert("In development, just choose Alpha.")}>
        Bravo
      </button>
    </div>
  );
};

export default Home;
