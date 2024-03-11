/*
 * Api: Chat Services
 */

import { RoomIds } from "../../typings/RoomIds";
import { MessageDTO } from "../../dtos/MessageDto";

import { model } from "mongoose";
import { ChatAlphaSchema, ChatBravoSchema } from "../../model/Chat";
import CustomError from "../utils/CustomError";

export const getChats = async (roomId: RoomIds) => {
  try {
    const roomModel = model(
      "",
      roomId === "alpha" ? ChatAlphaSchema : ChatBravoSchema
    );

    return roomModel.find().sort({ timestamp: -1 }).limit(32);
  } catch (error: any) {
    throw new CustomError("getChats service error", error.message);
  }
};

export const storeMessage = async ({
  userId,
  user,
  msg,
  roomId,
}: MessageDTO) => {
  try {
    const roomModel = model(
      "",
      roomId === "alpha" ? ChatAlphaSchema : ChatBravoSchema
    );

    const chat = new roomModel({
      _id: userId,
      username: user,
      message: msg,
    });
    await chat.save();

    return roomModel.findOne().sort({ timestamp: -1 });
  } catch (error: any) {
    throw new CustomError("storeMessage service error", error.message);
  }
};
