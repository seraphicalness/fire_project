
// // 1 회원가입 시 모든 정보 받기
// // 이미 유저 존재하는지도 확인 
// const Signup = async (req, res)=>{
// 	const { username, email, password } = req.body;

// try {
//     // 사용자가 이미 존재하는지 확인
//     let user = await userSchema.findOne({ username });
//     if (user) {
//     return res.status(400).json({ msg: 'User already exists' });
//     }

//     // 새로운 유저 생성
//     user = new userSchema({
//     username,
//     email,
//     password,
//     });

//     // 비밀번호 해싱 (UserSchema의 pre('save')로 처리)
//     // save로 진행한 해싱과정 동작하는지 확인
//     await user.save();

//     // 토큰 생성
//     const payload = {
//     user: {
//         id: user.id,
//     },
//     };

//     // 토큰으로 저장 
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     // 토큰 반환
//     res.json({ token });
// } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
// }
// };


// // 2 로그인
// const Login = async (req, res)=>{
//     const { username, password } = req.body;
//     dotenv.config();
// }

// // 사용자 존재하는지 확인
// const user = await userSchema.findOne({ username });
// if (!user) {
// return res.status(400).json({ msg: 'Invalid credentials' });
// }

// // 비밀번호 매칭 
// const isMatch = await user.matchPassword(password);
// if (!isMatch) {
// return res.status(400).json({ msg: 'Invalid credentials' });
// }

// // 회원확인 되었으니 로그인 상태를 유지하기 위한 JWT토큰을 발행
// const payload = {
//     user: {
//     id: user.id,
//     },
// };

// const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
// res.json({ token });


// export { Signup, Login };

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import userSchema from '../schemas/userSchema.js';

// 1 회원가입 시 모든 정보 받기
// 이미 유저 존재하는지도 확인 
const Signup = async (req, res) => {
    console.log("회원가입 요청 데이터:", req.body);
    const { username, email, password } = req.body;

    try {
        // 사용자가 이미 존재하는지 확인
        let user = await userSchema.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // 새로운 유저 생성
        user = new userSchema({
            username,
            email,
            password,
        });

        // 비밀번호 해싱 (UserSchema의 pre('save')로 처리)
        await user.save();

        // 토큰 생성
        const payload = {
            user: {
                id: user.id,
            },
        };

        // 토큰으로 저장 
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 토큰 반환
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// 2 로그인
const Login = async (req, res) => {
    const { username, password } = req.body;
    dotenv.config();

    try {
        // 사용자 존재하는지 확인
        const user = await userSchema.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // 비밀번호 매칭 
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // 회원확인 되었으니 로그인 상태를 유지하기 위한 JWT토큰을 발행
        const payload = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export { Signup, Login };
