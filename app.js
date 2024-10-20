import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import connect from './connect/connect.js';
import boardRouter from "./routes/boardRouter.js";
import userRouter from './routes/userRouter.js';
import dotenv from 'dotenv';
import User from './models/Users.js';
dotenv.config();  // 환경 변수 로드

const PORT = 3002;   // 내가 실행한 포트번호 
const app = express();

connect();  // 몽고디비와 연결하는 함수 

app.use(bodyParser.json()); // 클라이언트에서 전송한 JSON 형태의 요청 본문을 파싱
app.use(express.urlencoded({ extended: false }));  // URL-인코딩된 데이터를 파싱

// CORS 설정을 라우터 앞에 적용
app.use(cors({
    origin: 'http://localhost:3000',  // 허용할 도메인
    methods: ['GET', 'POST', 'DELETE', 'PUT'],  // 허용할 HTTP 메소드
    credentials: true,  // 인증과 함께 요청할 수 있게 설정
}));

app.use('/board', boardRouter);
app.use('/user', userRouter); // 사용자 관련 API 라우터를 '/user' 경로에 매핑

// 로그인 API 추가
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body; // 클라이언트로부터 이메일과 비밀번호 받기

    try {
        // 이메일로 사용자 찾기
        const user = await User.findOne({ email });

        // 사용자 존재 여부 및 비밀번호 확인
        if (!user || user.password !== password) {
            return res.status(401).send({ message: "로그인 실패: 잘못된 이메일 또는 비밀번호" });
        }

        // 로그인 성공 시
        res.status(200).send({ message: "로그인 성공" });
    } catch (error) {
        console.error('로그인 에러:', error);
        res.status(500).send({ message: "서버 에러" });
    }
});

app.listen(PORT, () => {
    console.log(`server start on ${PORT}`);  // 서버 시작
});


// import bodyParser from 'body-parser';
// import express from 'express';
// import cors from 'cors';
// import connect from './connect/connect.js';
// import boardRouter from "./routes/boardRouter.js";
// import userRouter from './routes/userRouter.js';

// const PORT = 3000;
// const app = express();

// connect();  // 몽고디비와 연결하는 함수 

// app.use(bodyParser.json()); // 클라이언트에서 전송한 JSON 형태의 요청 본문을 파싱하여 req.body에 담아줌
// app.use(express.urlencoded({extended : false}));  // - URL-인코딩된 데이터를 파싱하여 req.body에 담아줍니다.
//  //  extend : false는 querystring 모듈을 사용하여 쿼리 스트링을 파싱하겠다는 의미
// app.use(cors({  // CORS 정책을 설정하여 다른 도메인에서의 요청을 허용
//     origin : 'http://localhost:3000',  // 허용할 도메인 지정 
//     method : ['GET', 'POST', 'DELETE', 'PUT'],  // 허용할 http 메소드 지정 
//     credentials : true,
// }));

// app.listen(PORT, ()=>{
// 	console.log(`server start on ${PORT}`);  // 서버시작 
// });


// app.use('/board', boardRouter);
// app.use('/user', userRouter); // 사용자 관련 API 라우터를 '/user' 경로에 매핑
