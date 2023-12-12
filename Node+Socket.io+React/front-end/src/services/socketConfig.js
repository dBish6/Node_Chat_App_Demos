import { io } from "socket.io-client";

export const socket = io("http://localhost:4000");

const socketConfig = () => {
  const engine = socket.io.engine;

  socket.on("connect_error", async (error) => {
    console.error({
      info: "Socket connection error attempting to retry connection...",
      ERROR: error.message,
    });
  });
  socket.on("connect", () => {
    console.log(`Connection established; ${socket.id}`);
  });

  engine.on("packet", ({ type, data }) => {
    // Called for each packet received.
    console.log("Received:", { type: type, data: data });
  });
  engine.on("packetCreate", ({ type, data }) => {
    // Called for each packet sent.
    console.log("Sent:", { type: type, data: data });
  });
};

export default socketConfig;
