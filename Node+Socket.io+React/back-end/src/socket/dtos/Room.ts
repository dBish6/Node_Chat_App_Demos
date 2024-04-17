import { RoomIds } from "../../typings/RoomIds";

export interface UserDTO {
  userId: string;
  username: string;
  roomId: RoomIds;
}

export interface JoinOrLeaveDTO extends UserDTO {
  userId: string;
  type: "join" | "leave";
}

export interface TypingDTO extends UserDTO {
  isTyping: boolean;
}
