import express from 'express';
import multer from 'multer';
import path from 'path';
import Post from '../schemas/postSchema.js'; // 포스트 스키마 임포트
import User from '../schemas/userSchema.js'; // User 스키마 임포트
import { authware } from '../middleware/auth.js'; // 인증 미들웨어

const router = express.Router();

// multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// 글 작성 라우트
router.post('/', authware, upload.array('images', 10), async (req, res) => {
  try {
    const { content } = req.body;
    const imageUrls = req.files.map(file => `http://localhost:3000/uploads/${file.filename}`);

    const newPost = new Post({
      content,
      images: imageUrls,
      author: req.user._id, // 인증 미들웨어에서 설정한 사용자 ID로 author 설정
    });

    await newPost.save();
    res.status(201).json({ message: '글이 작성되었습니다.', post: newPost });
  } catch (error) {
    console.error('글 작성 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 모든 게시글을 가져오는 라우트 (피드)
router.get('/', async (req, res) => {
  const { page = 1, limit = 25 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find().skip(skip).limit(Number(limit)).populate('author', 'username');
    res.status(200).json(posts);
    console.log(posts);
  } catch (error) {
    console.error('게시글 가져오기 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).populate('author', 'username');
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    // res.status(200).json(post);
    res.status(200).json({
      ...post.toObject(),
      likes: post.likes.length, // 좋아요 개수만 반환
    });
  } catch (error) {
    console.error('게시글 가져오기 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 특정 사용자의 ObjectId로 게시글 조회 (userId를 직접 사용)
router.get('/user/:userId', async (req, res) => {
  // console.log(`Fetching posts for userId: ${req.params}`);   //백엔드에서 클라이언트 요청을 정상적으로 수신하는지 확인

  const { page = 1, limit = 25 } = req.query;
  const { userId } = req.params;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find({ author: userId })
      .skip(skip)
      .limit(Number(limit))
      .populate('author', 'username'); // author 필드에서 username 가져오기

    res.status(200).json(posts);
    console.log(posts);
  } catch (error) {
    console.error('게시글 가져오기 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 좋아요 기능
router.post('/:postId/like', authware, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id); // 좋아요 추가
      await post.save();
    }
    console.log("현재 좋아요 개수:", post.likes.length); // 개수를 확인
    res.status(200).json({ likes: post.likes.length }); // 좋아요 개수만 전송
  } catch (error) {
    res.status(500).json({ message: '좋아요 오류', error });
  }
});

// 좋아요 취소 기능
router.post('/:postId/unlike', authware, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    post.likes = post.likes.filter((userId) => userId.toString() !== req.user._id.toString()); // 좋아요 취소
    await post.save();

    console.log("현재 좋아요 개수:", post.likes.length); // 개수를 확인
    res.status(200).json({ likes: post.likes.length }); // 좋아요 개수만 전송
  } catch (error) {
    res.status(500).json({ message: '좋아요 취소 오류', error });
  }
});


export default router;


