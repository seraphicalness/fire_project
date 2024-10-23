import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // 스타일 필요 시 사용

const Header = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="App-header">
      <nav className="navbar">
        <div className="navbar-title">열받침</div>
        <ul className="navbar-menu">
          <li><button className="menu-button" onClick={() => navigate('/feed')}>피드</button></li>
          <li><button className="menu-button" onClick={() => navigate('/event')}>이벤트</button></li>
          <li><button className="menu-button" onClick={() => navigate('/notifications')}>알림</button></li>
          <li><button className="menu-button" onClick={() => navigate('/mypage')}>마이페이지</button></li>
        </ul>
        <div className="auth-buttons">
          {/* 로그인 상태에 따라 로그인/로그아웃 버튼을 표시 */}
          {isLoggedIn ? (
            <>
              <button className="auth-button" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <button className="auth-button" onClick={() => navigate('/login')}>로그인</button>
              <button className="auth-button" onClick={() => navigate('/signup')}>회원가입</button>
            </>
          )}
          {/* <button className="auth-button" onClick={() => navigate('/login')}>로그인</button> */}
          {/* <button className="auth-button" onClick={() => navigate('/signup')}>회원가입</button> */}
        </div>
      </nav>
    </header>
  );
};

export default Header;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Header.css'; // 스타일이 필요하면 이 파일도 생성
// import Login from '../pages/Login';

// const Header = () => {
//   const navigate = useNavigate();

//   return (
//     <header className="App-header">
//       <nav className="navbar">
//         <div className="navbar-title">열받침</div>
//         <ul className="navbar-menu">
//           <li><a href="#feed">피드</a></li>
//           <li><a href="#event">이벤트</a></li>
//           <li><a href="#notifications">알림</a></li>
//           <li><a href="#mypage">마이페이지</a></li>
//         </ul>
//         <div className="auth-buttons">
//           <button className="auth-button" onClick={() => navigate('/Login')}>로그인</button>
//           <button className="auth-button" onClick={() => navigate('/Signup')}>회원가입</button>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;