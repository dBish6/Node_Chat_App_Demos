import { io } from "socket.io-client";
import apiUrl from "../constants/apiUrl";

export const socket = io(`${apiUrl.split("/api")[0]}/chat`);

const socketConfig = () => {
  const engine = socket.io.engine,
    engineLogs = true;

  socket.on("connect_error", async (error) => {
    console.error({
      info: "Socket connection error attempting to retry connection...",
      ERROR: error.message,
    });
  });
  socket.on("connect", () => {
    console.log(`Connection established; ${socket.id}`);
  });

  if (process.env.NODE_ENV !== "production" && engineLogs) {
    engine.on("packet", ({ type, data }) => {
      // Called for each packet received.
      console.log("Received:", { type: type, data: data });
    });
    engine.on("packetCreate", ({ type, data }) => {
      // Called for each packet sent.
      console.log("Sent:", { type: type, data: data });
    });
  }
};

export default socketConfig;
