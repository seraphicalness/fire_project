import User from "../schemas/userSchema.js";
// import { authware } from "../middleware/auth.js"; // 미들웨어로 사용하는 auth import
// const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";

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

export const login = async (req, res) => {
  try {
    // 1. 요청된 아이디가 데이터베이스에 있는지 확인
    const user = await User.findOne({ username: req.body.username });
    
    if (!user) {
      return res.status(400).json({
        loginSuccess: false,
        message: "해당 아이디를 가진 유저가 없습니다.",
      });
    }

    // 2. 비밀번호가 맞는지 확인
    const isMatch = await user.comparePassword(req.body.password);
    
    if (!isMatch) {
      return res.status(400).json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다.",
      });
    }

    // 3. JWT 토큰 생성
    const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });  // 토큰 생성

    // 4. 토큰을 쿠키에 저장한 후 성공 메시지 반환
    res.cookie("x_auth", token, { httpOnly: true })
      .status(200)
      .json({ 
        loginSuccess: true, 
        userId: user._id,
        username: user.username,
        token  // 응답에 토큰 포함
      });
    
  } catch (err) {
    // 에러 처리: 서버 내부 오류 발생 시 500 에러 반환
    return res.status(500).json({
      loginSuccess: false, 
      message: "로그인 중 서버 오류가 발생했습니다.", 
      error: err.message 
    });
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



// // // 1 회원가입 시 모든 정보 받기
// // // 이미 유저 존재하는지도 확인 
// // const Signup = async (req, res)=>{
// // 	const { username, email, password } = req.body;

// // try {
// //     // 사용자가 이미 존재하는지 확인
// //     let user = await userSchema.findOne({ username });
// //     if (user) {
// //     return res.status(400).json({ msg: 'User already exists' });
// //     }

// //     // 새로운 유저 생성
// //     user = new userSchema({
// //     username,
// //     email,
// //     password,
// //     });

// //     // 비밀번호 해싱 (UserSchema의 pre('save')로 처리)
// //     // save로 진행한 해싱과정 동작하는지 확인
// //     await user.save();

// //     // 토큰 생성
// //     const payload = {
// //     user: {
// //         id: user.id,
// //     },
// //     };

// //     // 토큰으로 저장 
// //     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

// //     // 토큰 반환
// //     res.json({ token });
// // } catch (err) {
// //     console.error(err.message);
// //     res.status(500).send('Server error');
// // }
// // };


// // // 2 로그인
// // const Login = async (req, res)=>{
// //     const { username, password } = req.body;
// //     dotenv.config();
// // }

// // // 사용자 존재하는지 확인
// // const user = await userSchema.findOne({ username });
// // if (!user) {
// // return res.status(400).json({ msg: 'Invalid credentials' });
// // }

// // // 비밀번호 매칭 
// // const isMatch = await user.matchPassword(password);
// // if (!isMatch) {
// // return res.status(400).json({ msg: 'Invalid credentials' });
// // }

// // // 회원확인 되었으니 로그인 상태를 유지하기 위한 JWT토큰을 발행
// // const payload = {
// //     user: {
// //     id: user.id,
// //     },
// // };

// // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
// // res.json({ token });


// // export { Signup, Login };

// import dotenv from 'dotenv';
// import jwt from 'jsonwebtoken';
// import userSchema from '../schemas/userSchema.js';

// // 1 회원가입 시 모든 정보 받기
// // 이미 유저 존재하는지도 확인 
// const Signup = async (req, res) => {
//     console.log("회원가입 요청 데이터:", req.body);
//     const { username, email, password } = req.body;

//     try {
//         // 사용자가 이미 존재하는지 확인
//         let user = await userSchema.findOne({ username });
//         if (user) {
//             return res.status(400).json({ msg: 'User already exists' });
//         }

//         // 새로운 유저 생성
//         user = new userSchema({
//             username,
//             email,
//             password,
//         });

//         // 비밀번호 해싱 (UserSchema의 pre('save')로 처리)
//         await user.save();

//         // 토큰 생성
//         const payload = {
//             user: {
//                 id: user.id,
//             },
//         };

//         // 토큰으로 저장 
//         const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//         // 토큰 반환
//         res.json({ token });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };

// // 2 로그인
// const Login = async (req, res) => {
//     const { username, password } = req.body;
//     dotenv.config();

//     try {
//         // 사용자 존재하는지 확인
//         const user = await userSchema.findOne({ username });
//         if (!user) {
//             return res.status(400).json({ msg: 'Invalid credentials' });
//         }

//         // 비밀번호 매칭 
//         const isMatch = await user.matchPassword(password);
//         if (!isMatch) {
//             return res.status(400).json({ msg: 'Invalid credentials' });
//         }

//         // 회원확인 되었으니 로그인 상태를 유지하기 위한 JWT토큰을 발행
//         const payload = {
//             user: {
//                 id: user.id,
//             },
//         };

//         const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };

// export { Signup, Login };