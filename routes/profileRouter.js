import express from "express";
// import multer from "multer";
import upload from "../config/multerConfig.js";
import { authware } from "../middleware/auth.js";
import { uploadProfileImage, uploadBackgroundImage, getProfileInfo, updateProfile } from "../controllers/profileController.js";// import { uploadProfileImage, uploadBackgroundImage, uploadFeedImage } from "../controllers/imageController.js";

const router = express.Router();
// const upload = multer({ dest: "uploads/" });


// 프로필 이미지 업로드 라우트
router.post("/upload-profile", authware, upload.single("profile"), uploadProfileImage);

// 배경 이미지 업로드 라우트
router.post("/upload-background", authware, upload.single("background"), uploadBackgroundImage);

// 프로필 정보 조회 라우트
router.get("/info", authware, getProfileInfo);

router.put("/update-profile", authware, updateProfile);  // 추가된 경로


// 피드 페이지에 올리는 사진 업로드 라우트
// router.post("/upload-feed", uploadFeedImage);

export default router;
