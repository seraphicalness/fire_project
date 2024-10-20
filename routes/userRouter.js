import express from 'express';
import { Login, Signup } from '../controllers/userController.js';
import jwt from 'jsonwebtoken';

const userRouter = express.Router();

// userRouter.post('/signup', Signup);
// 회원가입 라우터 예시
userRouter.post('/signup', async (req, res) => {
    try {
        // 사용자 생성 과정
        const user = new User(req.body);
        await user.save();

        // JWT 토큰 생성
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (err) {
        console.error(err);  // 에러 로그 출력
        res.status(500).json({ message: 'Server error' });
    }
});
userRouter.post('/login', Login);

// app.use('/user', userRouter); // 사용자 관련 API 라우터를 '/user' 경로에 매핑

export default userRouter;