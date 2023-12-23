import { store } from "../redux/store";
import history from "./history";

export const handleJoinRoom = (room) => {
  const roomId = room.toLowerCase();
  dispatch(roomConnect({ type: "join", roomId }));
  history.push(`/rooms/${roomId}`);
};

export const handleLeaveRoom = () => {
  store.dispatch(roomConnect({ type: "leave" }));
  history.push("/home");
};
