import React, { useState } from "react";
import axios from "axios";  // axios 임포트

const Signup = () => {
  const [username, setUsername] = useState('');  
  // const [name, setName] = useState('');  
  const [password, setPassword] = useState('');  
  const [email, setEmail] = useState('');  
  const [message, setMessage] = useState('');  // 성공 또는 실패 메시지 상태 관리

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3002/user/signup', {
        username,
        email,
        password
      });

      // 회원가입 성공 시 메시지 출력
      setMessage("회원가입 성공!");
      console.log("회원가입 성공:", res.data);

    } catch (error) {
      if (error.response && error.response.data) {
        // 백엔드에서 반환한 오류 메시지 사용
        setMessage("회원가입 실패인거같진않음: " + error.response.data.msg);
      } else {
        // 서버가 응답하지 않거나 다른 이유로 발생한 오류 처리
        setMessage("회원가입 실패: 서버 응답 없음");
      }
      console.error("회원가입 실패:", error);
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} className="signup-form">
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
          <label htmlFor="email">이메일</label>
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

        <button type="submit" className="signup-button">회원가입</button>
      </form>
      {message && <p>{message}</p>} {/* 메시지 출력 */}
    </div>
  );
};

export default Signup;