import { Router } from "express";
import * as chatController from "../controllers/chatController";
import { chatNamespace } from "../server";
import { messageSocket } from "../services/chatService";

const router = Router();

router.get("/", chatController.getChats);
chatNamespace.on("connect", async (socket) =>
  messageSocket(socket, chatNamespace)
);

export default router;
