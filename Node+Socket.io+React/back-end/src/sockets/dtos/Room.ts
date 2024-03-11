import { RoomIds } from "../../typings/RoomIds";

export interface SocketDTO {
  user: string;
  roomId: RoomIds;
}

export interface JoinOrLeaveDTO extends SocketDTO {
  userId: string;
  type: "join" | "leave";
}

export interface TypingDTO extends SocketDTO {
  isTyping: boolean;
}
