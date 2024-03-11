import { Socket, Namespace } from "socket.io";
import { SocketCallback } from "../typings/SocketCallback";
import { JoinOrLeaveDTO, TypingDTO } from "../dtos/Room";
import { MessageDTO } from "../../dtos/MessageDto";

import ChatService from "../services/chatService";

const chatNamespace = (socket: Socket, io: Namespace) => {
  const service = new ChatService(socket, io);

  socket.on("manage_room", (data: JoinOrLeaveDTO, callback: SocketCallback) =>
    service.manageRoom(data, callback)
  );

  socket.on("typing", (data: TypingDTO, callback: SocketCallback) =>
    service.typing(data, callback)
  );

  socket.on("msg", async (data: MessageDTO, callback: SocketCallback) =>
    service.message(data, callback)
  );
};

export default chatNamespace;
