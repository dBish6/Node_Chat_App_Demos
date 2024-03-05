export const selectMessages = (state) =>
  state.chat.roomId ? state.chat.messages[state.chat.roomId] : [];
export const selectRoomId = (state) => state.chat.roomId;
