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
    </div>
  );
};

export default Event;