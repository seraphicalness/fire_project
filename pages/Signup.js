// import React, { useState } from "react";
// import axios from "axios";  // axios 임포트

// const Signup = () => {
//   const [username, setUsername] = useState('');  
//   const [password, setPassword] = useState('');  
//   const [email, setEmail] = useState('');  
//   const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인용 상태 추가
//   const [message, setMessage] = useState('');  // 성공 또는 실패 메시지 상태 관리

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // 비밀번호와 비밀번호 확인이 일치하는지 확인
//     if (password !== confirmPassword) {
//       setMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
//       return;
//     }

//     try {
//       const res = await axios.post('http://localhost:3000/user/signup', {  // 올바른 포트 사용 (3002)
//         username,
//         email,
//         password
//       });

//       // 회원가입 성공 시 메시지 출력
//       setMessage("회원가입 성공!");
//       console.log("회원가입 성공:", res.data);

//     } catch (error) {
//       if (error.response && error.response.data) {
//         // 백엔드에서 반환한 오류 메시지 사용
//         setMessage("회원가입 실패: " + error.response.data.msg);
//       } else {
//         // 서버가 응답하지 않거나 다른 이유로 발생한 오류 처리
//         setMessage("회원가입 실패: 서버 응답 없음");
//       }
//       console.error("회원가입 실패:", error);
//     }
//   };

//   return (
//     <div className="signup-container">
//       <h2>회원가입</h2>
//       <form onSubmit={handleSubmit} className="signup-form">
//         <div className="form-group">
//           <label htmlFor="username">아이디 </label>
//           <input 
//             type="text"
//             id="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//             placeholder="아이디를 입력하세요"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="email">이메일 </label>
//           <input 
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             placeholder="이메일을 입력하세요"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="password">비밀번호 </label>
//           <input 
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             placeholder="비밀번호를 입력하세요"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="confirmPassword">비밀번호 확인</label>
//           <input 
//             type="password"
//             id="confirmPassword"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//             placeholder="비밀번호를 다시 입력하세요"
//           />
//         </div>

//         <button type="submit" className="signup-button">회원가입</button>
//       </form>
//       {message && <p>{message}</p>} {/* 메시지 출력 */}
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from "react";
import axios from "axios";  // axios 임포트

const Signup = () => {
  const [username, setUsername] = useState('');  
  const [password, setPassword] = useState('');  
  const [email, setEmail] = useState('');  
  const [message, setMessage] = useState('');  // 성공 또는 실패 메시지 상태 관리

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Axios를 통해 백엔드에 요청 보냄
      const response = await axios.post("http://localhost:3000/user/signup", {
        username,
        email,
        password
      }, { withCredentials: true });  // 쿠키를 포함해서 요청

      // 성공적인 회원가입 메시지 출력
      setMessage("회원가입 성공!");
      console.log("회원가입 성공:", response.data);

    } catch (error) {
      // 에러 처리
      if (error.response && error.response.data) {
        setMessage("회원가입 실패거나 이미 존재함: " + error.response.data.msg);
      } else {
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
          <label htmlFor="username">아이디 </label>
          <input 
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="이름을 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일 </label>
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
          <label htmlFor="password">비밀번호 </label>
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