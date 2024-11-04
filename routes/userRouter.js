import express from "express";
import jwt from 'jsonwebtoken'; // JWT를 사용하여 토큰 검증
import { authware } from "../middleware/auth.js"; // 미들웨어로 사용하는 auth import
import { signup, login, auth, logout, getUserProfile } from "../controllers/userController.js";  // 컨트롤러에서 authUser 가져오기

const router = express.Router();

// 회원가입
router.post("/signup", signup);

// 로그인
router.post("/login", login);


// 인증 경로 (auth 미들웨어 사용 후, authUser 컨트롤러로 처리)
router.get("/auth", authware, auth);  // 미들웨어 auth를 먼저 적용하고, 인증된 유저 정보를 반환

// 로그아웃 (auth 미들웨어 사용)
router.get("/logout", authware, logout);  // 로그아웃은 인증된 사용자만 가능하므로 auth 미들웨어 사용

// 토큰 검증 엔드포인트
router.get('/verify-token', (req, res) => {
const authHeader = req.headers.authorization;


// 사용자 프로필 정보 가져오기
router.get('/profile', authware, getUserProfile);

// Authorization 헤더가 없는 경우
if (!authHeader) {
    return res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
}

const token = authHeader.split(' ')[1]; // 'Bearer token'에서 토큰만 추출

// 토큰이 없는 경우
if (!token) {
    return res.status(401).json({ message: '토큰이 없습니다.' });
}

// 토큰 검증
jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
    // 토큰이 유효하지 않은 경우
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
    // 토큰이 유효한 경우
    res.json({ message: '토큰이 유효합니다.', userId: decoded.userId });
});
});

export default router;

