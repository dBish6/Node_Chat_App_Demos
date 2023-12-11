import { Schema, model } from "mongoose";

const ChatSchema = new Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default model("chats", ChatSchema);
