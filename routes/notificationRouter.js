// routes/notificationRouter.js
import express from 'express';
import Notification from '../schemas/notificationSchema.js';
import { authware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authware, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user._id })
      .sort({ createdAt: -1 }) // 최신 순으로 정렬
      .populate('userId', 'username') // 알림을 발생시킨 사용자 정보
      .populate('postId', 'content'); // 관련된 게시글 정보

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: '알림 가져오기 실패', error });
  }
});

export default router;