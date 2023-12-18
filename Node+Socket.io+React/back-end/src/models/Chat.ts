import { Schema } from "mongoose";

export const ChatAlphaSchema = new Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// export const ChatAlpha = model("chat_alpha", ChatAlphaSchema);

export const ChatBravoSchema = new Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// export const ChatBravo = model("chat_bravo", ChatBravoSchema);
