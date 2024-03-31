/*
 * Api: Chat Services
 */

import { RoomIds } from "../../typings/RoomIds";
import { MessageDTO } from "../../dtos/MessageDto";

import { roomModals } from "../../model/Chat";
import CustomError from "../utils/CustomError";

export const getChats = async (roomId: RoomIds) => {
  try {
    const roomModel = roomModals[roomId];

    return roomModel.find().sort({ timestamp: -1 }).limit(32);
  } catch (error: any) {
    throw new CustomError("getChats service error", error.message);
  }
};

export const storeMessage = async ({
  userId,
  username,
  msg,
  roomId,
}: MessageDTO) => {
  try {
    const roomModel = roomModals[roomId];

    const chat = new roomModel({
      _id: `${userId}__${Math.random().toString(36).substring(2, 6)}`,
      username,
      message: msg,
    });
    await chat.save();

    return roomModel.findOne().sort({ timestamp: -1 });
  } catch (error: any) {
    throw new CustomError("storeMessage service error", error.message);
  }
};
