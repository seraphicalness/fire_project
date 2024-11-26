// server.js
import http from 'http';
import { WebSocketServer } from 'ws';
import app from './app.js'; // Express 앱 가져오기

// HTTP 서버와 WebSocket 서버 초기화
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket 연결 이벤트
wss.on('connection', (ws) => {
  console.log('WebSocket 연결 성공');

  // 메시지 수신 처리
  ws.on('message', (message) => {
    console.log('수신 메시지:', message);

    // 클라이언트로 메시지 전송
    ws.send(`서버로부터 수신된 메시지: ${message}`);
  });

  // 연결 종료 처리
  ws.on('close', () => {
    console.log('WebSocket 연결 종료');
  });
});

// 서버 실행
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});