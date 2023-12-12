import Chat from "../models/Chat";

export const getChats = async () => {
  try {
    return await Chat.find().sort({ timestamp: -1 }).limit(32);
  } catch (error: any) {
    throw new Error("getChats error;\n" + error.message);
  }
};
