import React, { useState } from "react";
import axios from "axios";
import "../css/CreatePost.css"; // 필요한 스타일링

const CreatePost = ({ onClose }) => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState(""); // 에러 메시지 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 상태 추가

  // 내용 변경 핸들러
  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  // 이미지 선택 핸들러
  const handleImagesChange = (event) => {
    setImages(event.target.files);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (event) => {
    event.preventDefault();

    // 폼 데이터 생성
    const formData = new FormData();
    formData.append("content", content);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    setIsSubmitting(true); // 제출 중 상태 설정

    try {
      // 서버에 글과 이미지 전송
      const token = localStorage.getItem("token"); // 인증 토큰
      if (!token) {
        console.error("토큰이 없습니다. 로그인 상태를 확인하세요.");
        return;
      }
      await axios.post("http://localhost:3000/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // 글 작성 완료 후 초기화
      setContent("");
      setImages([]);
      setError("");
      console.log("글 작성 성공"); // 글 작성 성공 시 콘솔에 출력
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("글 작성 오류:", error);
      setError("글 작성 중 오류가 발생했습니다."); // 에러 메시지 설정
    } finally {
      setIsSubmitting(false); // 제출 상태 초기화
    }
  };

  return (
    <div className="create-post-modal">
      <form onSubmit={handleSubmit}>
        <h2>새 글 작성</h2>
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={handleContentChange}
          required
        />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
        />
        {error && <p className="error-message">{error}</p>} {/* 에러 메시지 표시 */}
        <div className="button-group">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "게시 중..." : "게시하기"}
          </button>
          <button type="button" onClick={onClose}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;