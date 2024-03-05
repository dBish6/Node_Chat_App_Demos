/* Chat App Demo (back-end)
 * Version: 2.3.2
 *
 * Author: David Bishop
 * Creation Date: December 10, 2023
 * Last Updated: March 5, 2024
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

import { JoinOrLeaveDTO, TypingDTO, MessageDTO } from "./dtos/Room";
import { SocketCallback } from "./typings/SocketCallback";

import express from "express";
import dotenv from "dotenv";

import bodyParser from "body-parser";
import cors from "cors";

import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler";

import { createServer } from "http";
import { connect } from "mongoose";
import { Server } from "socket.io";

import chatRouter from "./routes/chatRoute";

import { storeMessage } from "./services/chatService";

const app = express();
dotenv.config();

const PORT = Number(process.env.HOST) || 4000,
  baseUrl = "/api";

// **Middleware**
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// *Security*
const corsOptions = { origin: "http://localhost:3000", credentials: true };
app.use(cors(corsOptions));
app.use(helmet()); // Protects various HTTP headers that can help defend against common web hacks.
app.use(hpp()); // Protects against HTTP Parameter Pollution attacks.
// Rate-limiting - used to limit repeated requests.
app.use((req, res, next) => {
  rateLimit({
    windowMs: 60 * 60 * 1000, // 60 Minutes
    max: 55, // limit each IP to 55 requests per windowMs.
    message:
      "Too many requests made from this IP, please try again after an hour.",
  })(req, res, next);
});

// Request logger.
morgan.token("all-headers", (req) => {
  return JSON.stringify(req.headers, null, 2);
});
// app.use(
//   morgan(":method :url :status :response-time ms \n headers: :all-headers")
// );
app.use(morgan("dev"));

// Custom error handler.
app.use(errorHandler);

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: corsOptions,
});

// TODO: Move
io.on("connection", (socket) => {
  console.log(`User connected; ${socket.id}.`);

  socket.on("manage_room", (data: JoinOrLeaveDTO, callback: SocketCallback) => {
    const { roomId, user, type } = data;

    try {
      if (roomId) {
        socket[type](roomId);

        const isType = type === "join" ? "joined" : "left";
        console.log(`${user} ${isType} room ${roomId}.`);

        // This message is in a object to resemble how the chat messages look in the db, sort of, if you were wondering.
        io.in(roomId).emit("get_msg", {
          message: `${user} has ${isType} the chat.`,
        });

        callback(null, { message: `You joined the chat.` });
      } else {
        callback("No room id was given in the request.");
      }
    } catch (error: any) {
      console.error("manage_room socket error:\n", error.message);
      callback(error.message);
    }
  });

  socket.on("typing", (data: TypingDTO, callback: SocketCallback) => {
    const { user, roomId, isTyping } = data;
    console.log("User typing", data);

    try {
      if (!user) {
        return callback("No user was given in the request.");
      }

      socket.in(roomId).emit("user_typing", { user, isTyping });
      isTyping
        ? callback(null, "User typing emitted.")
        : callback(null, "User stopped typing.");
    } catch (error: any) {
      console.error("typing socket error:\n", error.message);
      callback(error.message);
    }
  });

  socket.on("msg", async (data: MessageDTO, callback: SocketCallback) => {
    console.log("Received message: ", data);

    // TODO: You can maybe send the user id for the document stored?
    try {
      const sentMessage = await storeMessage({ ...data });
      io.in(data.roomId).emit("get_msg", sentMessage); // Sends back the message for all users connected to the room.

      callback(null, "Message emitted.");
    } catch (error: any) {
      console.error("msg socket error:\n", error.message);
      callback(error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected; ${socket.id}.`);
  });
});

// *Namespaces*
// export const chatNamespace = io.of(`${baseUrl}/chat`);

// *Routers*
app.use(`${baseUrl}/chat`, chatRouter);

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

app.get("/", async (req, res) => {
  res.json({ message: "Hello from the back-end!" });
});
