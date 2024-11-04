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
    res.status(200).json(post);
  } catch (error) {
    console.error('게시글 가져오기 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 특정 사용자의 ObjectId로 게시글 조회 (userId를 직접 사용)
router.get('/post/user/:userId', async (req, res) => {
  console.log(`Fetching posts for userId: ${req.params.userId}`);   //백엔드에서 클라이언트 요청을 정상적으로 수신하는지 확인

  const { page = 1, limit = 25 } = req.query;
  const { userId } = req.params;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find({ author: userId })
      .skip(skip)
      .limit(Number(limit))
      .populate('author', 'username'); // author 필드에서 username 가져오기

    res.status(200).json(posts);
  } catch (error) {
    console.error('게시글 가져오기 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// username으로 사용자 조회 후 해당 사용자의 ObjectId로 게시글 조회
router.get('/user/username/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 찾은 ObjectId로 게시글 검색
    const posts = await Post.find({ author: user._id }).populate('author', 'username');
    res.status(200).json(posts);
  } catch (error) {
    console.error("게시글 가져오기 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

export default router;




// // routes/postRouter.js
// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import Post from '../schemas/postSchema.js'; // 포스트 스키마 임포트
// import { authware } from '../middleware/auth.js'; // 인증 미들웨어

// const router = express.Router();

// // multer 설정
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // 업로드 폴더
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // 파일명 설정
//   },
// });

// const upload = multer({ storage });

// // 글 작성 라우트
// router.post('/', authware, upload.array('images', 10), async (req, res) => {
//   try {
//     console.log(req.user.userId); // userId 확인을 위한 로그 추가

//     const { content } = req.body;
//     const imageUrls = req.files.map(file => `http://localhost:3000/uploads/${file.filename}`);

//     const newPost = new Post({
//       content,
//       images: imageUrls,
//       author: req.user._id, // 인증 미들웨어에서 설정한 사용자 ID로 author 설정
//     });

//     await newPost.save();

//     res.status(201).json({ message: '글이 작성되었습니다.', post: newPost });
//   } catch (error) {
//     console.error('글 작성 오류:', error);
//     res.status(500).json({ message: '서버 오류가 발생했습니다.' });
//   }
// });

// // 모든 게시글을 가져오는 라우트 추가 (피드)
// router.get('/', async (req, res) => {
//   const { page = 1, limit = 25 } = req.query;
//   const skip = (page - 1) * limit;

//   try {
//     const posts = await Post.find().skip(skip).limit(Number(limit)).populate('author', 'username');
//     res.status(200).json(posts);
//   } catch (error) {
//     console.error('게시글 가져오기 오류:', error);
//     res.status(500).json({ message: '서버 오류가 발생했습니다.' });
//   }
// });

// // 특정 사용자의 게시글만 가져오는 라우트 (마이페이지용)
// router.get('/user/:userId', async (req, res) => {
//     const { page = 1, limit = 25 } = req.query;
//     const { userId } = req.params;
//     const skip = (page - 1) * limit;
  
//     try {
//       const posts = await Post.find({ author: userId })
//         .skip(skip)
//         .limit(Number(limit))
//         .populate('author', 'username'); // author 필드에서 username 가져오기
//         console.log("User posts:", posts); // 응답 데이터 확인

//       res.status(200).json(posts);
//     } catch (error) {
//       console.error('게시글 가져오기 오류:', error);
//       res.status(500).json({ message: '서버 오류가 발생했습니다.' });
//     }
// });

// router.get('/user/:userId', async (req, res) => {
//     const { page = 1, limit = 25 } = req.query;
//     const { userId } = req.params;
//     const skip = (page - 1) * limit;
  
//     try {
//       const posts = await Post.find({ author: userId }) // 'author' 필드를 userId로 필터링
//         .skip(skip)
//         .limit(Number(limit))
//         .populate('author', 'username'); // author 필드에서 작성자 정보 가져오기
  
//       res.status(200).json(posts);
//     } catch (error) {
//       console.error('게시글 가져오기 오류:', error);
//       res.status(500).json({ message: '서버 오류가 발생했습니다.' });
//     }
//   });


//   router.get("/user/:username", async (req, res) => {
//     const { username } = req.params;
  
//     try {
//       // username으로 User에서 ObjectId 찾기
//       const user = await User.findOne({ username });
//       if (!user) {
//         return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
//       }
  
//       // 해당 ObjectId로 게시글 찾기
//       const posts = await Post.find({ author: user._id });
//       res.status(200).json(posts);
//     } catch (error) {
//       console.error("게시글 가져오기 오류:", error);
//       res.status(500).json({ message: "서버 오류가 발생했습니다." });
//     }
//   });

// export default router;


// // routes/postRouter.js
// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import Post from '../schemas/postSchema.js'; // 포스트 스키마 임포트
// import { authware } from '../middleware/auth.js'; // 인증 미들웨어

// const router = express.Router();

// // multer 설정
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // 업로드 폴더
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // 파일명 설정
//   },
// });

// const upload = multer({ storage });

// // 글 작성 라우트   / 만 사용해도 /posts 하위의 경로로 인식
// router.post('/', authware, upload.array('images', 10), async (req, res) => {
//   try {
//     const { content } = req.body;
//     const imageUrls = req.files.map(file => `http://localhost:3000/uploads/${file.filename}`);

//     const newPost = new Post({
//       content,
//       images: imageUrls,
//       author: req.user.userId, // 인증 미들웨어에서 설정한 사용자 ID
//     });

//     await newPost.save();

//     res.status(201).json({ message: '글이 작성되었습니다.', post: newPost });
//   } catch (error) {
//     console.error('글 작성 오류:', error);
//     res.status(500).json({ message: '서버 오류가 발생했습니다.' });
//   }
// });

// // 모든 게시글을 가져오는 라우트 추가
// // 게시글 목록 가져오기 (페이지네이션 포함)
// router.get('/', async (req, res) => {
//     const { page = 1, limit = 25 } = req.query; // 쿼리 파라미터에서 페이지와 제한 수 가져옴
//     const skip = (page - 1) * limit;
  
//     try {
//       const posts = await Post.find().skip(skip).limit(Number(limit));
//       res.status(200).json(posts);
//     } catch (error) {
//       console.error('게시글 가져오기 오류:', error);
//       res.status(500).json({ message: '서버 오류가 발생했습니다.' });
//     }
//   });

// // 특정 사용자의 게시글만 가져오는 라우트 (마이페이지용)
// // postRouter.js에서 사용자별 게시물을 가져오는 라우트 확인
// router.get('/user/:userId', async (req, res) => {
//     const { page = 1, limit = 25 } = req.query;
//     const { userId } = req.params;
//     const skip = (page - 1) * limit;
  
//     try {
//       const posts = await Post.find({ author: userId }).skip(skip).limit(Number(limit));
//       res.status(200).json(posts);
//     } catch (error) {
//       console.error('게시글 가져오기 오류:', error);
//       res.status(500).json({ message: '서버 오류가 발생했습니다.' });
//     }
//   });

// export default router;