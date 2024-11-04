// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from "../schemas/userSchema.js"; // User 모델 임포트

const authware = async (req, res, next) => { 
  console.log("Authorization Header:", req.headers.authorization); // 추가
  console.log("Cookies:", req.cookies); // 추가

  
  const token = req.headers.authorization?.split(' ')[1];  // Bearer 방식의 헤더에서 토큰 추출

  if (!token) {
    return res.status(401).json({ isAuth: false, error: "토큰이 제공되지 않았습니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ isAuth: false, error: "사용자를 찾을 수 없습니다." });
    }

    req.user = user; // 인증된 사용자 설정
    next();
  } catch (err) {
    console.error('인증 미들웨어 오류:', err);
    return res.status(401).json({
      isAuth: false,
      error: err.name === "TokenExpiredError" ? "토큰이 만료되었습니다." : "유효하지 않은 토큰입니다."
    });
  }
};

export { authware };


// import User from '../schemas/userSchema.js';
// import jwt from "jsonwebtoken";


// const authware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: "인증 헤더가 없습니다." });
//   }

//   const token = authHeader.split(" ")[1]; // 'Bearer token'에서 토큰만 추출
//   if (!token) {
//     return res.status(401).json({ message: "토큰이 없습니다." });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
//     }
//     req.userId = decoded.userId;
//     next();
//   });
// };




// const authware = async (req, res, next) => {
//   const token = req.cookies.x_auth;

//   if (!token) {
//     return res.status(401).json({ isAuth: false, error: '토큰이 제공되지 않았습니다.' });
//   }

//   try {
//     const user = await User.findByToken(token);
//     if (!user) {
//       return res.status(401).json({ isAuth: false, error: '유효하지 않은 토큰입니다.' });
//     }

//     req.token = token;
//     req.user = user;
//     next();
//   } catch (error) {
//     console.error('인증 오류:', error);
//     res.status(500).json({ isAuth: false, error: '서버 오류가 발생했습니다.' });
//   }
// };

// export { authware };