import { RoomIds } from "../typings/RoomIds";
import { Message } from "../dtos/Room";
import { model } from "mongoose";
import { ChatAlphaSchema, ChatBravoSchema } from "../models/Chat";

export const getChats = async (roomId: RoomIds) => {
  try {
    const roomModel = model(
      `chat_${roomId}`,
      roomId === "alpha" ? ChatAlphaSchema : ChatBravoSchema
    );

    return await roomModel.find().sort({ timestamp: -1 }).limit(32);
  } catch (error: any) {
    throw new Error("getChats error;\n" + error.message);
  }
};

export const storeMessage = async ({ user, msg, roomId }: Message) => {
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
