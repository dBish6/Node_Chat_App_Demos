import { store } from "../redux/store";
import roomConnect from "../services/roomConnect";
import history from "./history";

export const handleJoinRoom = (room) => {
  console.log("Hello?");
  const roomId = room.toLowerCase();
  store.dispatch(roomConnect({ type: "join", roomId }));
  history.push(`/rooms/${roomId}`);
};

export const handleLeaveRoom = () => {
  store.dispatch(roomConnect({ type: "leave" }));
  history.push("/home");
};
