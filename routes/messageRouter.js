import express from "express";
import Message from "../schemas/messageSchema.js";
import Chat from "../schemas/chatSchema.js";
import { authware } from "../middleware/auth.js";

const router = express.Router();

// 메시지 전송
router.post("/:chatId", authware, async (req, res) => {
  const { content } = req.body;
  const { chatId } = req.params;

  try {
    const message = await Message.create({
      chatId,
      senderId: req.user._id,
      content,
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      updatedAt: Date.now(),
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "메시지 전송 오류", error });
  }
});

// 특정 채팅방의 메시지 조회
router.get("/:chatId", authware, async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
    .populate(
      "senderId",
      "username"
    );
    res.status(200).json(messages);  // 메세지 리스트 반환 
  } catch (error) {
    res.status(500).json({ message: "메시지 조회 오류", error });
  }
});

export default router;