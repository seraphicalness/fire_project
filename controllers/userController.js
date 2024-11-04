import User from "../schemas/userSchema.js";
// import { authware } from "../middleware/auth.js"; // 미들웨어로 사용하는 auth import
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'; // bcrypt 임포트



// 회원가입

export const signup = async (req, res) => {
  try {
    const user = new User(req.body);  // 새로운 User 인스턴스 생성

    // save()는 이제 Promise를 반환하므로 await로 처리
    const userInfo = await user.save();

    // 성공 시 응답
    return res.status(200).json({ success: true, userInfo });

  } catch (err) {
    // 에러 처리
    return res.status(400).json({ success: false, err });
  }
};

// 로그인

// export const login = async (req, res) => {
//   try {
//     // 1. 요청된 아이디가 데이터베이스에 있는지 확인
//     const user = await User.findOne({ username: req.body.username });
    
//     if (!user) {
//       return res.status(400).json({
//         loginSuccess: false,
//         message: "해당 아이디를 가진 유저가 없습니다.",
//       });
//     }

//     // 2. 비밀번호가 맞는지 확인
//     const isMatch = await user.comparePassword(req.body.password);
    
//     if (!isMatch) {
//       return res.status(400).json({
//         loginSuccess: false,
//         message: "비밀번호가 틀렸습니다.",
//       });
//     }

//     // 3. JWT 토큰 생성
//     const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });  // 토큰 생성

//     // 4. 토큰을 쿠키에 저장한 후 성공 메시지 반환
//     res.cookie("x_auth", token, { httpOnly: true })
//       .status(200)
//       .json({ 
//         loginSuccess: true, 
//         userId: user._id,
//         username: user.username,
//         token  // 응답에 토큰 포함
//       });
    
//   } catch (err) {
//     // 에러 처리: 서버 내부 오류 발생 시 500 에러 반환
//     return res.status(500).json({
//       loginSuccess: false, 
//       message: "로그인 중 서버 오류가 발생했습니다.", 
//       error: err.message 
//     });
//   }
// };

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 사용자 조회
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ loginSuccess: false, message: '존재하지 않는 아이디입니다.' });
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ loginSuccess: false, message: '비밀번호가 일치하지 않습니다.' });
    }

    // 토큰 생성
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 쿠키에 토큰 설정 (필요 시)
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,  // HTTPS가 아닌 환경에서는 false로 설정
      sameSite: 'Lax',  // 또는 'Strict', 'None' (CORS 설정에 따라)
    });

    // 세션에 사용자 정보 저장
    req.session.user = {
      userId: user._id,
      username: user.username,
    };

    // 로그인 성공 응답
    res.json({
      loginSuccess: true,
      message: '로그인에 성공했습니다.',
      token,  // 필요에 따라 토큰을 응답에 포함
      username: user.username,
      userId: user._id,
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ loginSuccess: false, message: '서버 오류가 발생했습니다.' });
  }
};

//인증
export const auth = (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
    image: req.user.image,
  });
};

// 로그아웃
export const logout = (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
};

// 프로필 이미지 업로드
export const uploadProfileImage = async (req, res) => {
  try {
    const imageUrl = `http://localhost:3000/${req.file.path}`;
    const userId = req.user._id;  // 인증된 사용자 ID 사용
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true } // 업데이트 후 새로운 객체 반환
    );

    res.json({ imageUrl: updatedUser.profileImage });
  } catch (error) {
    console.error("프로필 이미지 업로드 오류:", error);
    res.status(500).json({ message: "프로필 이미지 업로드 오류" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('username profileImage backgroundImage');
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('사용자 정보 불러오기 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
