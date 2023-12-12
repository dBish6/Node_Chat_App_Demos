/*
 *  @Author David Bishop
 */

interface Message {
  user: string;
  msg: string;
}

import express from "express";
import dotenv from "dotenv";

import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";
import cors from "cors";

import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import chatRouter from "./routes/chatRoute";

import { createServer } from "http";
import { connect } from "mongoose";
import { Server } from "socket.io";

import Chat from "./models/Chat";

const app = express();
dotenv.config();

const PORT = Number(process.env.HOST) || 4000,
  baseUrl = "/api";

// **Middleware**
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cookieParser());

const corsOptions = { origin: "http://localhost:3000", credentials: true };
app.use(cors(corsOptions));

// *Security*
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
app.use(
  morgan(":method :url :status :response-time ms \n headers: :all-headers")
);

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: corsOptions,
});

io.on("connection", (socket) => {
  console.log(`User connected; ${socket.id}.`);
  // TODO:
  socket.on("typing", async (user: string) => {
    socket.broadcast.emit("typing", user);
  });

  socket.on("msg", async ({ user, msg }: Message) => {
    console.log("Received message: ", { user, msg });

    const chat = new Chat({
      username: user,
      message: msg,
    });
    await chat.save();
    const sentChat = await Chat.findOne().sort({ timestamp: -1 });
    // Sends to all connected clients, including the sender.
    socket.emit("get_msg", sentChat);
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
