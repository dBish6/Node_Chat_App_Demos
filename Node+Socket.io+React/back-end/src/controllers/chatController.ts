import { Request, Response, NextFunction } from "express";

import * as chatService from "../services/chatService";

export const getChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatList = await chatService.getChats();

    return res.status(200).json({ chats: chatList });
  } catch (error: any) {
    // error.reason = "failed to send chat.";
    next(error);
  }
};
