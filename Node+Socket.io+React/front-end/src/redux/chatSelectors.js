export const selectRoomId = (state) => state.chat.roomId;
export const selectUserList = (state) =>
  state.chat.roomId ? state.chat.userList[state.chat.roomId] : [];
export const selectMessages = (state) =>
  state.chat.roomId ? state.chat.messages[state.chat.roomId] : []; // You can maybe change this when you persist it.
