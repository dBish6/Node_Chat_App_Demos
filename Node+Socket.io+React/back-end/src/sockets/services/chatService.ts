/*
 * Sockets: Chat Services
 */

import { Socket, Namespace } from "socket.io";
import { RoomIds } from "../../typings/RoomIds";
import { SocketCallback } from "../typings/SocketCallback";
import { JoinOrLeaveDTO, TypingDTO } from "../dtos/Room";
import { MessageDTO } from "../../dtos/MessageDto";

import { storeMessage } from "../../api/services/chatService";

// TODO: Use a better data structure.
interface SocketUser {
  userId: string;
  username: string;
  roomId: RoomIds;
}
let usersJoined: { alpha: SocketUser[]; bravo: SocketUser[] } = {
  alpha: [],
  bravo: [],
};

// TODO: Custom logger.
// TODO: We don't need to be sending the userId, username, etc. From the front-end anymore since we have this.currentUser now.
class ChatService {
  private socket: Socket;
  private io: Namespace;
  private currentUser: SocketUser | null;

  constructor(socket: Socket, io: Namespace) {
    this.socket = socket;
    this.io = io;
    this.currentUser = null;
  }

  // Handles joins and leaves of chat rooms and sends the amount users in the room initially.
  manageRoom(data: JoinOrLeaveDTO, callback: SocketCallback) {
    const { roomId, username, type } = data;

    if (!["join", "leave"].includes(type)) {
      throw Error(
        "manageRoom service error:\n There was no data provide for a join or the type isn't valid; 'leave' or 'join'."
      );
    }

    try {
      if (roomId) {
        this.socket[type](roomId);

        const isType = type === "join" ? "joined" : "left";
        console.log(`${username} ${isType} room ${roomId}.`);

        // This message is in an object to resemble how the chat messages look in the db, sort of, if you were wondering.
        this.io.in(roomId).emit("get_msg", {
          message: `${username} has ${isType} the chat.`,
        });

        const userList = this.userList(data);
        callback(
          null,
          type === "join"
            ? { userList, message: { message: "You joined the chat." } }
            : "You left the chat."
        );
      } else {
        callback("No room id was given in the request.");
      }
    } catch (error: any) {
      console.error("manageRoom service error:\n", error.message);
      callback(error.message);
    }
  }
  // Handles and emits the joined users list in each room and also sets the this.currentUser.
  userList(data: JoinOrLeaveDTO) {
    const { userId, roomId, username, type } = data || {};
    console.log(
      `${username} is being ${
        type === "join" ? "added" : "removed"
      } to the ${roomId} user list.`
    );

    try {
      if (roomId) {
        if (type === "leave") {
          usersJoined[roomId] = usersJoined[roomId].filter(
            (user) => user.userId !== this.socket.id
          );
          this.currentUser = null;

          this.io.in(roomId).emit("user_list", usersJoined);
        } else if (
          type === "join" &&
          data &&
          !usersJoined[roomId].find((user) => user.userId === userId)
        ) {
          const user = { userId, username, roomId };
          this.currentUser = user;
          usersJoined[roomId].push(user);

          this.io.in(roomId).emit("user_list", usersJoined);
        }
        return usersJoined;
      } else {
        throw Error(
          "manageRoom socket error:\n No room id was given in the request."
        );
      }
    } catch (error: any) {
      throw Error("manageRoom service error:\n" + error.message);
    }
  }

  // Handles if a user is typing in a chat room.
  typing(data: TypingDTO, callback: SocketCallback) {
    const { username, roomId, isTyping } = data;
    console.log("User typing", data);

    try {
      if (!username) return callback("No user was given in the request.");

      this.socket.in(roomId).emit("user_typing", { username, isTyping });
      isTyping
        ? callback(null, "User typing emitted.")
        : callback(null, "User stopped typing.");
    } catch (error: any) {
      console.error("typing service error:\n", error.message);
      callback(error.message);
    }
  }

  // Handles the messages of a chat room; stores the message and sends it back.
  async message(data: MessageDTO, callback: SocketCallback) {
    console.log("Received message: ", data);

    try {
      const sentMessage = await storeMessage({ ...data });
      this.io.in(data.roomId).emit("get_msg", sentMessage); // Sends back the message for all users connected to the room.

      callback(null, "Message emitted.");
    } catch (error: any) {
      console.error("msg service error:\n", error.message);
      callback(error.message);
    }
  }

  // Handles socket instance disconnection.
  disconnect() {
    console.log(`Socket disconnected; ${this.socket.id}.`);

    if (this.currentUser) {
      try {
        this.userList({ ...this.currentUser, type: "leave" });
      } catch (error: any) {
        console.error("disconnect service error:\n", error.message);
      }
    }
  }
}

export default ChatService;
