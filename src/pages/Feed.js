import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Feed.css';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  // 게시글을 서버에서 가져오는 함수
  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/posts?page=${page}&limit=25`);
      const newPosts = response.data;

      if (newPosts.length > 0) {
        // 중복 방지를 위해 기존 posts에 포함되지 않은 새 게시글만 추가
        setPosts((prevPosts) => {
          const uniquePosts = newPosts.filter(
            (newPost) => !prevPosts.some((post) => post._id === newPost._id)
          );
          // return [...prevPosts, ...uniquePosts];
          // 최신 게시글을 상단에 추가
          return [...uniquePosts, ...prevPosts];
        });
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('게시글 가져오기 오류:', error);
    }
  }, [page]);

  // 스크롤이 바닥에 닿으면 게시글을 로드하는 함수
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && hasMore) {
      fetchPosts();
    }
  }, [fetchPosts, hasMore]);

  useEffect(() => {
    fetchPosts(); // 초기 데이터 로드
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchPosts, handleScroll]); // 의존성 배열에 추가

    // 게시글 클릭 시 상세 페이지로 이동
    const openPostDetail = (postId) => {
      navigate(`/post/${postId}`);
    };
  
  return (
      <div className="photo-grid">
        {posts.map((post, index) => (
          <div key={index} className="photo-placeholder" onClick={() => openPostDetail(post._id)}>
            <img src={post.images[0]} alt="Post" className="photo-image" />
            <p>{post.content}</p>
          </div>
        ))}
      </div>
  );
}

export default Feed;


// import React, { useState, useEffect } from 'react';
// import '../css/Feed.css'; // 스타일을 위한 CSS 파일 임포트

// function Feed() {
//   const [photos, setPhotos] = useState(Array(16).fill(null)); // Initial 16 placeholders

//   // Function to load more photos as the user scrolls
//   const loadMorePhotos = () => {
//     setPhotos((prevPhotos) => [...prevPhotos, ...Array(25).fill(null)]); // Add more placeholders
//   };

//   // Detect when user scrolls to the bottom and load more photos
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
//         loadMorePhotos();
//       }
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <div className="photo-grid">
//       {photos.map((_, index) => (
//         <div key={index} className="photo-placeholder"></div>
//       ))}
//     </div>
//   );
// }

// export default Feed;