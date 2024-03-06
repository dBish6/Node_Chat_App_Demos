import { store } from "../redux/store";
import emitManageRoom from "../services/emitManageRoom";

export const handleJoinRoom = async (room) =>
  store.dispatch(emitManageRoom({ type: "join", roomId: room.toLowerCase() }));

export const handleLeaveRoom = async () =>
  store.dispatch(
    emitManageRoom({ type: "leave", roomId: store.getState().chat.roomId })
  );
