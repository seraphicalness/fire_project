import express from 'express';
import { list, find, write, update, remove } from '../controllers/boardController.js'; // 함수들을 import

const boardRouter = express.Router();

boardRouter.post('/create', write); // 글 생성
boardRouter.put('/update', update); // 글 업데이트
boardRouter.delete('/delete/:id', remove); // 글 삭제

boardRouter.get('/posts', list); // 전체 글 조회
boardRouter.get('/posts/:id', find); // 특정 글 조회

export default boardRouter;


// import express from 'express';

// const boardRouter = express.Router();

// // boardRouter.get('/list', list);
// // boardRouter.get('/find', find);
// boardRouter.post('/create', write);
// boardRouter.put('/update', update);
// // boardRouter.delete('/delete', remove); 밑으로 수정
// boardRouter.delete('/delete/:id', remove);

// boardRouter.get('/posts', list);
// boardRouter.get('/posts/:id', find);

// export default boardRouter;