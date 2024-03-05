import { RoomIds } from "../typings/RoomIds";
import { MessageDTO } from "../dtos/Room";

import { model } from "mongoose";
import { ChatAlphaSchema, ChatBravoSchema } from "../models/Chat";
import CustomError from "../utils/CustomError";

export const getChats = async (roomId: RoomIds) => {
  try {
    const roomModel = model(
      `chat_${roomId}`,
      roomId === "alpha" ? ChatAlphaSchema : ChatBravoSchema
    );

    return await roomModel.find().sort({ timestamp: -1 }).limit(32);
  } catch (error: any) {
    throw new CustomError("getChats service error", error.message);
  }
};

export const storeMessage = async ({ user, msg, roomId }: MessageDTO) => {
  // TODO: Error handling?
  const roomModel = model(
    `chat_${roomId}`,
    roomId === "alpha" ? ChatAlphaSchema : ChatBravoSchema
  );

  const chat = new roomModel({
    username: user,
    message: msg,
  });
  await chat.save();

  return await roomModel.findOne().sort({ timestamp: -1 });
};
