/*
 * Sockets Entry File
 */

import { Server } from "socket.io";
import chatNamespace from "./namespaces/chatNamespace";

const initializeSockets = async (io: Server) => {
  new Promise((resolve) => {
    // *Namespaces*
    io.of("/chat").on("connection", (socket) => {
      const id = socket.id;
      console.log(`User connected; ${id}.`);

      chatNamespace(socket, io.of("/chat"));

      socket.on("disconnect", () => {
        console.log(`User disconnected; ${id}.`);
      });
    });

    resolve(io);
  });
};

export default initializeSockets;
