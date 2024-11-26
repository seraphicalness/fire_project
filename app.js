// app.js
import express from "express";
import session from 'express-session';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connect from './connect/connect.js';  // ES Module 방식의 import
import userRouter from './routes/userRouter.js';
import postRouter from './routes/postRouter.js';
import profileRouter from "./routes/profileRouter.js";
import commentRouter from './routes/commentRouter.js';
import notificationRouter from './routes/notificationRouter.js'; 
import chatRouter from './routes/chatRouter.js';
import messageRouter from './routes/messageRouter.js';

import dotenv from 'dotenv';
import cors from 'cors';
import multer from "multer"; // multer 임포트
import path from "path"; // path 모듈 사용

// 환경 변수 설정
dotenv.config();

// Express 앱 생성
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// CORS 설정을 라우터 앞에 적용
// app.use(cors({
//     origin: 'http://localhost:3001',  // 허용할 도메인
//     methods: ['GET', 'POST', 'DELETE', 'PUT'],  // 허용할 HTTP 메소드
//     credentials: true,  // 인증과 함께 요청할 수 있게 설정, 쿠키 전송 허용 
// }));
// app.use(cors({ origin: '*', credentials: true })); // 임시로 모든 주소 허용 

const allowedOrigins = ['http://localhost:3001', 'http://localhost:3002'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('CORS 정책에 의해 차단된 도메인입니다.'));
      }
    },
    credentials: true, // 쿠키 및 인증 정보 허용
  })
);

app.use(session({
  secret: process.env.SESSION_SECRET,  // 안전한 secret key
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,  // 개발 단계에서 secure 옵션을 false로 설정, 배포 시 true로 설정 필요
    maxAge: 1000 * 60 * 60  // 세션 쿠키의 만료 시간 (예: 1시간)
  }
}));

// 몽고디비와 연결하는 함수
connect();

// Multer 설정: 파일을 서버에 저장
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // 서버 내 업로드 폴더에 저장
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일명 설정
  }
});

const upload = multer({ storage });

// // 파일 업로드 엔드포인트 (프로필 이미지)
// app.post('/user/upload-image', upload.single('image'), (req, res) => {
//   try {
//     console.log("Request File:", req.file); // 업로드된 파일 확인
//     if (!req.file) {
//       return res.status(400).json({ message: '파일이 없습니다.' });
//     }
//     const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
//     res.json({ imageUrl });
//   } catch (error) {
//     console.error("이미지 업로드 오류:", error); // 서버 오류 로깅
//     res.status(500).json({ message: '이미지 업로드 중 오류 발생' });
//   }
// });

// 정적 파일 제공: 업로드된 이미지에 접근할 수 있도록 설정
app.use('/uploads', express.static('uploads'));

// 유저 관련 라우트
app.use("/user", userRouter);
// 프로필 수정 라우터 
app.use("/profile", profileRouter);
// 댓글 라우터 
app.use('/comments', commentRouter);
// 기본 라우트
app.get("/", (req, res) => {
  res.send("Hello World!");
});
// 포스트 라우트 
app.use('/posts', postRouter);
// 알림 라우트
app.use('/notifications', notificationRouter);
// 채팅방 생성 
app.use('/chat', chatRouter);
// 메세지 보내기 
app.use('/message', messageRouter);

// 서버 실행
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});

export default app;