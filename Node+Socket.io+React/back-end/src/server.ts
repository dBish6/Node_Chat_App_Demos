/* Chat App Demo (back-end)
 * Version: 3.4.5
 *
 * Author: David Bishop
 * Creation Date: December 10, 2023
 * Last Updated: March 10, 2024
 *
 * Description:
 * This application is a demo chat app that allows users to exchange messages in real-time.
 *
 * Features:
 *  - Real-time messaging using Socket.io.
 *  - User typing indicators.
 *  - Joinable chat rooms.
 *  - Persistent message storage in MongoDB.
 *  - Redux for state management.
 *
 * Change Log:
 * The log is in the changelog.txt file at the base of this back-end directory.
 */

import dotenv from "dotenv";

import { createServer } from "http";
import { Server } from "socket.io";
import initializeApi from "./api";

import { connect } from "mongoose";

import initializeSockets from "./sockets";

dotenv.config();
export const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const setupServer = async () => {
  const PORT = Number(process.env.HOST) || 4000;

  const app = await initializeApi();
  console.log("Api initialized!");

  const httpServer = createServer(app),
    io = new Server(httpServer, {
      cors: corsOptions,
    });

  await initializeSockets(io);
  console.log("Sockets initialized!");

  httpServer.listen(PORT, "localhost", async () => {
    try {
      await connect(process.env.MONGODB_URL || "");
      console.log(
        `Server is running on ${process.env.PROTOCOL}${process.env.HOST}:${PORT}; Ctrl-C to terminate...`
      );
    } catch (error: any) {
      console.error("Server start error:\n" + error.message);
    }
  });

  return io;
};

setupServer();
