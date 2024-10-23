import express from "express";
import { authware } from "../middleware/auth.js"; // 미들웨어로 사용하는 auth import
import { signup, login, auth, logout } from "../controllers/userController.js";  // 컨트롤러에서 authUser 가져오기

const router = express.Router();

// 회원가입
router.post("/signup", signup);

// 로그인
router.post("/login", login);

// 인증 경로 (auth 미들웨어 사용 후, authUser 컨트롤러로 처리)
router.get("/auth", authware, auth);  // 미들웨어 auth를 먼저 적용하고, 인증된 유저 정보를 반환

// 로그아웃 (auth 미들웨어 사용)
router.get("/logout", authware, logout);  // 로그아웃은 인증된 사용자만 가능하므로 auth 미들웨어 사용

export default router;

