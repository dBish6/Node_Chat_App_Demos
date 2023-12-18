import { RoomIds } from "../typings/RoomIds";

export interface Join {
  user: string;
  roomId: RoomIds;
}

export interface Message extends Join {
  msg: string;
}
