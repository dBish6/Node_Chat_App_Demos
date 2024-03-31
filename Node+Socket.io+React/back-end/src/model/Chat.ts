import { Schema, model } from "mongoose";

export const ChatAlphaSchema = new Schema(
  {
    _id: { type: String },
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "chat_alpha" }
);

export const ChatBravoSchema = new Schema(
  {
    _id: { type: String },
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "chat_bravo" }
);

export const roomModals = {
  alpha: model("chat_alpha", ChatAlphaSchema),
  bravo: model("chat_bravo", ChatBravoSchema),
};
