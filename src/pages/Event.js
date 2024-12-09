import React, { useState, useEffect } from "react";
import "../css/Event.css";

const Event = () => {
  const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이드 인덱스
  const slideImages = [
    `${process.env.PUBLIC_URL}/images/image1.png`,
    `${process.env.PUBLIC_URL}/images/image2.png`,
    `${process.env.PUBLIC_URL}/images/image3.png`,
    `${process.env.PUBLIC_URL}/images/image4.png`,
  ]; // 이미지 배열을 미리 정의합니다.

  const eventTexts = [
    "🎉 # 해시태그로 여러분의 열받는 순간을 공유하세요",
    "📢 신규 가입 시, 포인트 증정",
    "🎁 일주일동안 가장 많이 불꽃을 받은 사람 이벤트",
    "🌟 추가 예정",
  ]; // 이벤트 문구 배열

  // 슬라이드가 2초마다 자동으로 넘어가도록 설정
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slideImages.length);
    }, 2000);
    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 인터벌을 정리
  }, [slideImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slideImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slideImages.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className="eventbox">
      <div className="eventrect">
        <button className="arrow left" onClick={prevSlide}>
          &lt;
        </button>
        <img
          src={slideImages[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
          className="slide-image"
        />
        <button className="arrow right" onClick={nextSlide}>
          &gt;
        </button>
      </div>
      <div className="box-container">
        {/* 이벤트 문구를 각 박스에 삽입 */}
        {eventTexts.map((text, index) => (
          <div key={index} className="box">
            <p className="event-text">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Event;