import { RoomIds } from "../../typings/RoomIds";
import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";

import * as chatService from "../services/chatService";

export const getChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chats = await chatService.getChats(req.query.roomId as RoomIds);

    return res.status(200).json({ chats });
  } catch (error: any) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("getChats controller error", error.message, 500)
    );
  }
};
