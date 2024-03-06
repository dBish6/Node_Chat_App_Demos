export const selectRoomId = (state) => state.chat.roomId;
export const selectMessages = (state) =>
  state.chat.roomId ? state.chat.messages[state.chat.roomId] : []; // You can maybe change this when you persist it.
