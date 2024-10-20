import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import 추가

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');  // 이메일 상태 관리
  const [password, setPassword] = useState('');  // 비밀번호 상태 관리
  const navigate = useNavigate(); // navigate 훅 사용

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 로그인 API 호출 (예: fetch)
    try {
      const response = await fetch('http://localhost:3002/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // 로그인 성공 시 상태 업데이트
        setIsLoggedIn(true);
        navigate('/'); // Feed 페이지로 리디렉션
      } else {
        // 로그인 실패 처리
        alert('로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">아이디 (이메일)</label>
          <input 
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="이메일을 입력하세요"
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
    </div>
  );
};

export default Login;
