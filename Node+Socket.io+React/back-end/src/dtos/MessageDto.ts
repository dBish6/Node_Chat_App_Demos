import { SocketDTO } from "../sockets/dtos/Room";

export interface MessageDTO extends SocketDTO {
  userId: string;
  msg: string;
}
