import express from "express";
import Chat from "../schemas/chatSchema.js";
import User from "../schemas/userSchema.js";
import { authware } from "../middleware/auth.js";

const router = express.Router();

// 채팅방 생성   /chat 
router.post('/create', authware, async (req, res) => {
    try {
      const { name, participants } = req.body; // 채팅방 이름과 참여자 정보
      const loggedInUserId = req.user._id;
  
      // 참여자 ID 찾기 (username -> userId 변환)
      const userDocs = await User.find(
        { username: { $in: participants } }, // 입력받은 username 리스트
        { _id: 1 } // ID만 가져옴
      );
  
      // 모든 참여자 ID 추가 (로그인한 사용자 포함)
      const participantIds = [...userDocs.map((user) => user._id), loggedInUserId];
  
      // 채팅방 생성
      const newChat = await Chat.create({
        name,
        participants: participantIds,
      });
  
      res.status(201).json(newChat);
    } catch (error) {
      console.error('채팅방 생성 오류:', error);
      res.status(500).json({ message: '채팅방 생성 오류', error });
    }
  });

// 사용자의 모든 채팅방 조회  /chat/chat-rooms
router.get('/chat-rooms', authware, async (req, res) => {
    try {
      const chatRooms = await Chat.find({ participants: req.user._id })
        .populate('participants', 'username'); // username만 포함
  
      res.status(200).json(chatRooms);
    } catch (error) {
      console.error('채팅방 목록 조회 오류:', error);
      res.status(500).json({ message: '채팅방 목록 조회 오류', error });
    }
  });

export default router;