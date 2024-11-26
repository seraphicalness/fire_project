import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true }, // 해당 메시지의 채팅방
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 보낸 사용자
  content: { type: String, required: true }, // 메시지 내용
  createdAt: { type: Date, default: Date.now }, // 생성 시간
},
{ timestamps: true }

);

export default mongoose.model("Message", messageSchema);