import React, { useState } from "react";
import "./Mypage.css";

const Mypage = () => {
  const [uploadedImages, setUploadedImages] = useState([]);

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
          <h2>이름: 사용자 이름</h2>
          <p>아이디: 사용자ID</p>
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
