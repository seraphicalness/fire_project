import express from "express";
import { uploadProfileImage, uploadBackgroundImage, uploadFeedImage } from "../controllers/imageController.js";

const router = express.Router();

// 프로필 이미지 업로드 라우트
router.post("/upload-profile", uploadProfileImage);

// 배경 이미지 업로드 라우트
router.post("/upload-background", uploadBackgroundImage);

// 피드 페이지에 올리는 사진 업로드 라우트
router.post("/upload-feed", uploadFeedImage);

export default router;
