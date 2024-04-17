/*
 * Socket Entry File
 */

import { Server } from "socket.io";
import chatNamespace from "./namespaces/chatNamespace";

const initializeSocket = async (io: Server) => {
  // *Namespaces*
  io.of("/chat").on("connection", (socket) => {
    console.log(`Socket connected; ${socket.id}.`);

    chatNamespace(socket, io.of("/chat"));
  });
};

export default initializeSocket;
