import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export const sendMessage = async (message) => {
  return new Promise((resolve, reject) => {
    socket.emit("msg", message, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.chats);
      }
    });
  });
};

export const subscribeToMessages = (callback) => {
  socket.on("msg", ({ chats }) => {
    callback(chats);
  });
};

export const handleSocketEvents = () => {
  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });
};
