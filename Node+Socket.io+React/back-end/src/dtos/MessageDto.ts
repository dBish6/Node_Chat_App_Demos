import { UserDTO } from "../socket/dtos/Room";

export interface MessageDTO extends UserDTO {
  userId: string;
  msg: string;
}
