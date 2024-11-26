// models/notificationSchema.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'like' or 'comment'
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 알림을 발생시킨 사용자
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 알림 수신자
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);