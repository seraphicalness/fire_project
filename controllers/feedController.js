import multer from "multer";
import path from "path";
import fs from "fs";
import Post from "../schemas/postSchema.js";

// 디렉토리가 존재하지 않을 경우 생성하는 함수
const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  };

// multer 설정 - 저장 위치와 파일 이름 지정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // 업로드할 파일의 저장 디렉토리 결정 (프로필 또는 배경)
      const uploadDir = req.body.type === 'profile' ? 'uploads/profile' : 'uploads/background';
      ensureDirectoryExistence(uploadDir); // 폴더가 없으면 생성
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // 현재 시간과 파일 확장자를 사용하여 파일명 설정
    }
  });

const upload = multer({ storage });
// export default upload;


// 피드에 게시글 업로드
export const uploadFeedImage = async (req, res) => {
  try {
    const imageUrl = `http://localhost:3000/${req.file.path}`;
    const post = new Post({
      author: req.user._id,
      content: req.body.content,
      images: [imageUrl],
    });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "피드 업로드 오류" });
  }
};

// 피드 페이지에 업로드할 이미지 핸들러
// export const uploadFeedImage = (req, res) => {
//   const uploadDir = 'uploads/feed';
//   ensureDirectoryExistence(uploadDir); // 피드 이미지 폴더가 없으면 생성
//   upload.single('image')(req, res, (err) => {
//     if (err) {
//       console.error("피드 이미지 업로드 오류:", err);
//       return res.status(500).json({ message: "피드 이미지 업로드 중 오류 발생" });
//     }
//     const imageUrl = `${req.protocol}://${req.get("host")}/uploads/feed/${req.file.filename}`;
//     res.json({ imageUrl });
//   });
// };
