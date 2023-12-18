import { Request, Response, NextFunction } from "express";

import * as chatService from "../services/chatService";

export const getChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chats = await chatService.getChats(
      req.query.roomId as "Alpha" | "Bravo"
    );

    return res.status(200).json({ chats });
  } catch (error: any) {
    // error.reason = "failed to send chat.";
    next(error);
  }
};
