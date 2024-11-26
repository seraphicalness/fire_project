import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';  // Router import
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import Event from './pages/Event.js'; // 이벤트 페이지 임포트
import Header from './components/Header.js'; // 헤더 임포트
import Feed from './pages/Feed.js'; // Feed 컴포넌트 임포트
import Mypage from './pages/Mypage.js';
import Notifications from './pages/Noticifications.js';
import PostDetail from './pages/PostDetail.js';
import axios from 'axios';
import './App.css';
import ChatPage from './pages/chat/ChatPage.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // 비동기 토큰 검증을 위한 로딩 상태

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 서버에 토큰 검증 요청
      axios
        .get('http://localhost:3000/user/verify-token', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setIsLoggedIn(true);
          setLoading(false);
        })
        .catch((error) => {
          console.error('토큰 검증 실패:', error);
          setIsLoggedIn(false);
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          setLoading(false);
        });
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');  // 토큰 제거
    localStorage.removeItem('userInfo'); // 로컬 스토리지에서 사용자 정보와 토큰 삭제 
    setIsLoggedIn(false);  // 로그인 상태 변경
    console.log('로그아웃 완료');  // 로그아웃 콘솔 출력
  };

  if (loading) {
    // 로딩 중일 때 표시할 내용 (선택 사항)
    return <div>로딩 중...</div>;
  }

  return (
    <Router>
    <div className="App">
    <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      {/* <Header /> Header 컴포넌트 추가 */}
      <Routes>
          {/* 모든 사용자가 접근 가능한 라우트 */}
          <Route path="/" element={isLoggedIn ? <Feed /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/post/:postId" element={<PostDetail />} /> {/* 상세 페이지 라우트 */}
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/feed' element={<Feed />} />
          <Route path="/event" element={<Event />} /> 
          <Route path="/notifications" element={<Notifications />} />
          {/* /mypage와 /mypage/:username 둘 다 접근 가능하게 설정 */}
          <Route path="/mypage" element={<Mypage />} /> {/* 기본 마이페이지 경로 */}
          <Route path="/mypage/:username" element={<Mypage />} /> {/* username이 포함된 마이페이지 경로 */}
          <Route path='/chatpage' element={<ChatPage/>} />
        </Routes>
    </div>
  </Router>
  );
}

export default App;