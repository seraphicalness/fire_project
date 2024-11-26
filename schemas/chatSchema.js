import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 채팅 참여자
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // 마지막 메시지 참조
  updatedAt: { type: Date, default: Date.now }, // 마지막 업데이트 시간
});

export default mongoose.model("Chat", chatSchema);