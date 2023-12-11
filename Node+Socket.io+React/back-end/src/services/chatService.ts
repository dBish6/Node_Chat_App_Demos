import { Socket, Namespace } from "socket.io";
import Chat from "../models/Chat";

interface Message {
  name: string;
  message: string;
}

export const getChats = async () => {
  try {
    return await Chat.find().sort({ timestamp: -1 }).limit(4);
  } catch (error: any) {
    throw new Error("getChats error;\n" + error.message);
  }
};

export const messageSocket = async (
  socket: Socket,
  chatNamespace: Namespace
) => {
  try {
    socket.on("typing", async (msg: Message) => {
      console.log("msg", msg);
      socket.broadcast.emit("typing", { msg: msg.name });
    });

    socket.on("msg", async (msg: Message) => {
      const chatList = await Chat.find().sort({ timestamp: -1 }).limit(4);
      chatNamespace.emit("msg", { chats: chatList });

      const chat = new Chat({
        username: msg.name,
        message: msg.message,
      });
      await chat.save();
      const chats = await Chat.find().sort({ timestamp: -1 }).limit(4);
      chatNamespace.emit("msg", { chats: chats });
    });

    socket.on("disconnect", () => console.log("Chat disconnected."));
  } catch (error: any) {
    throw new Error("messageSocket error;\n" + error.message);
  }
};
