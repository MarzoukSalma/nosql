import api from "./api";

export const getConversations = () => api.get("/conversations");
export const getMessages = (convId) => api.get(`/conversations/${convId}`);
export const sendMessage = (receiverId, data) =>
  api.post(`/conversations/private/${receiverId}`, data);
