import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
// import mongoose from "mongoose";
import connect from './connect/connect.js';  // ES Module 방식의 import
import userRouter from './routes/userRouter.js';
import dotenv from 'dotenv';
import cors from 'cors';

// 환경 변수 설정
dotenv.config();

// Express 앱 생성
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// CORS 설정을 라우터 앞에 적용
app.use(cors({
    origin: 'http://localhost:3001',  // 허용할 도메인
    methods: ['GET', 'POST', 'DELETE', 'PUT'],  // 허용할 HTTP 메소드
    credentials: true,  // 인증과 함께 요청할 수 있게 설정
}));

// 몽고디비와 연결하는 함수
connect();

// Routes
app.use("/user", userRouter);

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 서버 실행
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});