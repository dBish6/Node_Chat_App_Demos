/*
 * Sockets Entry File
 */

import { Server } from "socket.io";
import chatNamespace from "./namespaces/chatNamespace";

const initializeSockets = async (io: Server) => {
  new Promise((resolve) => {
    // *Namespaces*
    io.of("/chat").on("connection", (socket) => {
      console.log(`Socket connected; ${socket.id}.`);

      chatNamespace(socket, io.of("/chat"));
    });

    resolve(io);
  });
};

export default initializeSockets;
