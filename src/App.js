import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Router import
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import Event from './pages/Event.js'; // 이벤트 페이지 임포트
import Header from './components/Header.js'; // 헤더 임포트
import Feed from './pages/Feed.js'; // Feed 컴포넌트 임포트
import Mypage from './pages/Mypage.js';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
    <div className="App">
      <Header /> {/* Header 컴포넌트 추가 */}
      <Routes>
          <Route path="/" element={isLoggedIn ? <Feed /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/feed' element={<Feed />} />
          <Route path="/event" element={<Event />} /> 
          <Route path="/mypage" element={<Mypage />} /> 
        </Routes>
    </div>
  </Router>
  );
}

export default App;