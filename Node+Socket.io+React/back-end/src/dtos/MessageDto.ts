import { UserDTO } from "../sockets/dtos/Room";

export interface MessageDTO extends UserDTO {
  userId: string;
  msg: string;
}
