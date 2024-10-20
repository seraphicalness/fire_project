import React, { useState, useEffect } from 'react';
import './Feed.css'; // 스타일을 위한 CSS 파일 임포트

function Feed() {
  const [photos, setPhotos] = useState(Array(16).fill(null)); // Initial 16 placeholders

  // Function to load more photos as the user scrolls
  const loadMorePhotos = () => {
    setPhotos((prevPhotos) => [...prevPhotos, ...Array(25).fill(null)]); // Add more placeholders
  };

  // Detect when user scrolls to the bottom and load more photos
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadMorePhotos();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="photo-grid">
      {photos.map((_, index) => (
        <div key={index} className="photo-placeholder"></div>
      ))}
    </div>
  );
}

export default Feed;