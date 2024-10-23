import React, { useState, useEffect } from "react";
import "../css/Mypage.css";

const Mypage = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [userInfo, setUserInfo] = useState({ username: '', userId: '' });

  // 로컬 스토리지에서 사용자 정보 가져오기
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const images = files.map(file => URL.createObjectURL(file));
    setUploadedImages((prevImages) => prevImages.concat(images));
  };

  return (
    <div className="mybox">
      <div className="myrect" />

      <div className="profile-container">
        <img
          src="https://via.placeholder.com/100" // 프로필 사진 URL (예시)
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-info">
        <h2> {userInfo.username ? '@'+ userInfo.username : '로그인 필요'}</h2>  {/* 사용자 이름 표시 */}
          <button className="edit-profile-button">프로필 수정</button>
        </div>
      </div>

      <div className="upload-section">
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
        <div className="uploaded-images">
          {uploadedImages.map((image, index) => (
            <img key={index} src={image} alt={`Uploaded ${index}`} className="uploaded-image" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mypage;