/*
 * Sockets: Chat Services
 */

import { Socket, Namespace } from "socket.io";
import { RoomIds } from "../../typings/RoomIds";
import { SocketCallback } from "../typings/SocketCallback";
import { JoinOrLeaveDTO, TypingDTO } from "../dtos/Room";
import { MessageDTO } from "../../dtos/MessageDto";

import { storeMessage } from "../../api/services/chatService";

interface UsersJoined {
  userId: string;
  user: string;
  roomId: RoomIds;
}

// TODO: Custom logger.
class ChatService {
  private socket: Socket;
  private io: Namespace;
  private usersJoined: { alpha: UsersJoined[]; bravo: UsersJoined[] };

  constructor(socket: Socket, io: Namespace) {
    this.socket = socket;
    this.io = io;
    // TODO: Use a better data structure.
    this.usersJoined = { alpha: [], bravo: [] };
  }

  // Handles joins and leaves of chat rooms and the amount users in the room.
  manageRoom(data: JoinOrLeaveDTO, callback: SocketCallback) {
    const { roomId, user, type } = data;

    if (!["join", "leave"].includes(type)) {
      throw Error(
        "manage_room socket error:\n There was no data provide for a join or the type isn't valid; 'leave' or 'join'."
      );
    }

    try {
      if (roomId) {
        this.socket[type](roomId);

        const isType = type === "join" ? "joined" : "left";
        console.log(`${user} ${isType} room ${roomId}.`);

        // This message is in an object to resemble how the chat messages look in the db, sort of, if you were wondering.
        this.io.in(roomId).emit("get_msg", {
          message: `${user} has ${isType} the chat.`,
        });

        const userList = this.userList(data);
        type === "join"
          ? callback(null, {
              userList,
              message: { message: "You joined the chat." },
            })
          : callback(null, "You left the chat.");
      } else {
        callback("No room id was given in the request.");
      }
    } catch (error: any) {
      console.error("manage_room socket error:\n", error.message);
      callback(error.message);
    }
  }
  // Handles and emits the joined users list in each room (Joins doesn't happen from a emit).
  userList(data: JoinOrLeaveDTO, callback?: SocketCallback) {
    const { userId, roomId, user, type } = data || {};
    console.log(
      `${user} is being ${
        type === "join" ? "added" : "removed"
      } to the ${roomId} user list.`
    );

    try {
      if (roomId) {
        if (type === "leave") {
          this.usersJoined[roomId] = this.usersJoined[roomId].filter(
            (user) => user.userId !== this.socket.id
          );

          this.io.in(roomId).emit("user_list", this.usersJoined);
          callback!(
            null,
            `${user} has been removed from the ${roomId} user list.`
          );
        } else if (
          type === "join" &&
          data &&
          !this.usersJoined[roomId].find((u) => u.userId === userId)
        ) {
          this.usersJoined[roomId].push({ userId, user, roomId });

          this.io.in(roomId).emit("user_list", this.usersJoined);
          return this.usersJoined;
        }
        // console.log("usersJoined", this.usersJoined);
      } else {
        callback!("No room id was given in the request.");
      }
    } catch (error: any) {
      console.error("manage_room socket error:\n", error.message);
      if (callback) callback(error.message);
    }
  }

  // Handles if a user is typing in a chat room.
  typing(data: TypingDTO, callback: SocketCallback) {
    const { user, roomId, isTyping } = data;
    console.log("User typing", data);

    try {
      if (!user) {
        return callback("No user was given in the request.");
      }

      this.socket.in(roomId).emit("user_typing", { user, isTyping });
      isTyping
        ? callback(null, "User typing emitted.")
        : callback(null, "User stopped typing.");
    } catch (error: any) {
      console.error("typing socket error:\n", error.message);
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
      console.error("msg socket error:\n", error.message);
      callback(error.message);
    }
  }
}

export default ChatService;
