// multerConfig.js
import multer from "multer";
import path from "path";
import fs from "fs";

// 파일 저장 경로 및 파일 이름 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    if (file.fieldname === "profile") {
      uploadPath = "uploads/profile"; // 프로필 이미지 저장 경로
    } else if (file.fieldname === "background") {
      uploadPath = "uploads/background"; // 배경 이미지 저장 경로
    } else {
      uploadPath = "uploads/other"; // 기타 이미지 저장 경로
    }

    // 폴더가 없으면 생성
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 유니크 파일 이름 생성
  },
});

// 파일 형식과 크기 제한 설정
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("허용되지 않는 파일 형식입니다.");
    error.code = "INCORRECT_FILETYPE";
    return cb(error, false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 10000000, // 10MB
  },
});

export default upload;