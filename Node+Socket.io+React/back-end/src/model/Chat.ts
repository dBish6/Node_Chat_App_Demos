import { Schema } from "mongoose";

export const ChatAlphaSchema = new Schema(
  {
    _id: { type: String },
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "chat_alpha" }
);

// export const ChatAlpha = model("chat_alpha", ChatAlphaSchema);

export const ChatBravoSchema = new Schema(
  {
    _id: { type: String },
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "chat_bravo" }
);

// export const ChatBravo = model("chat_bravo", ChatBravoSchema);
