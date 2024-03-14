/* Chat App Demo (back-end)
 * Version: 3.6.11
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
import initializeApi, { corsOptions } from "./api";

import { connect } from "mongoose";

import initializeSockets from "./sockets";

dotenv.config(); // Loads the default .env.
dotenv.config({ path: `.env.${process.env.NODE_ENV}` }); // loads the environment specific .env if any.

const setupServer = async () => {
  const { PROTOCOL, HOST, PORT: ENV_PORT, MONGODB_URL } = process.env,
    PORT = Number(ENV_PORT) || 4000;

  const app = await initializeApi();
  console.log("Api initialized!");

  const httpServer = createServer(app),
    io = new Server(httpServer, {
      cors: corsOptions,
    });

  await initializeSockets(io);
  console.log("Sockets initialized!");

  httpServer.listen(PORT, HOST, async () => {
    try {
      await connect(MONGODB_URL || "");
      console.log(
        `Server is running on ${PROTOCOL}${HOST}:${PORT}; Ctrl-C to terminate...`
      );
    } catch (error: any) {
      console.error("Server start error:\n" + error.message);
    }
  });

  return io;
};

setupServer();
