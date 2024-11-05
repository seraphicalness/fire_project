import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // 페이지 이동을 위한 useNavigate
import axios from "axios";  // axios 임포트
import '../css/Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');  // 아이디 상태 관리
  const [password, setPassword] = useState('');  // 비밀번호 상태 관리
  const [message, setMessage] = useState('');    // 성공 또는 실패 메시지 상태 관리
  const navigate = useNavigate();  // 페이지 이동을 위한 navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/user/login', {  // 서버에 로그인 요청
        username,
        password
      });

      // 백엔드에서 loginSuccess 여부 확인
      if (response.data.loginSuccess) {
        // const token = response.data.token;  // 응답 데이터에서 토큰을 가져옴
        // localStorage.setItem('token', token);  // 토큰을 로컬 스토리지에 저장
        const { token, username } = response.data;
        // 사용자 정보 저장
        // const userInfo = { username: response.data.username, userId: response.data.userId };
        const userInfo = { username };
        localStorage.setItem('token', token);  // 토큰 저장
        localStorage.setItem('userInfo', JSON.stringify(userInfo));  // 사용자 정보 저장

        setIsLoggedIn(true);  // 로그인 상태 업데이트
        setMessage("로그인 성공!");
        console.log("로그인 성공:", response.data);
        navigate('/feed');  // 로그인 후 피드 페이지로 리디렉션
      } else {
        // 로그인 실패 시 메시지 처리
        setIsLoggedIn(false);  // 로그인 실패 시 상태 유지
        setMessage(response.data.message || '로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
      }
    } catch (error) {
      if (error.response) {
        // 서버에서 응답을 받았을 때 오류 메시지 처리
        setMessage('로그인 실패: ' + (error.response.data.message || '서버 오류'));
      } else {
        // 네트워크 오류 등
        setMessage('로그인 중 네트워크 오류가 발생했습니다.');
      }
      console.error('로그인 에러:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">아이디</label>
          <input 
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="아이디를 입력하세요"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input 
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        
        <button type="submit" className="login-button">로그인</button>
      </form>
      {message && <p>{message}</p>} {/* 로그인 성공 또는 실패 메시지 출력 */}
    </div>
  );
};

export default Login;