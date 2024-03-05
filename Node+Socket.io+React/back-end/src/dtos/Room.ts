import { RoomIds } from "../typings/RoomIds";

interface SocketDTO {
  user: string;
  roomId: RoomIds;
}

export interface JoinOrLeaveDTO extends SocketDTO {
  type: "join" | "leave";
}

export interface TypingDTO extends SocketDTO {
  isTyping: boolean;
}

export interface MessageDTO extends SocketDTO {
  msg: string;
}
