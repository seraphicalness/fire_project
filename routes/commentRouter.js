// routes/commentRouter.js
import express from 'express';
import { authware } from '../middleware/auth.js';
import Comment from '../schemas/commentSchema.js';
import Post from '../schemas/postSchema.js';

const router = express.Router();

// 댓글 생성
router.post('/:postId', authware, async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: postId,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: '댓글 생성 오류', error });
  }
});

// 특정 게시글의 댓글 조회
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId }).populate('author', 'username');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: '댓글 조회 오류', error });
  }
});

// 댓글 수정
router.put('/:commentId', authware, async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;
    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, author: req.user._id },
      { content },
      { new: true }
    );
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: '댓글 수정 오류', error });
  }
});

// 댓글 삭제
router.delete('/:commentId', authware, async (req, res) => {
  try {
    const { commentId } = req.params;
    await Comment.deleteOne({ _id: commentId, author: req.user._id });
    res.status(200).json({ message: '댓글이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '댓글 삭제 오류', error });
  }
});

export default router;