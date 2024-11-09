import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/PostDetail.css';
import fireIcon from './image/Fire_icon.png'; // 이미지를 사용할 경로에 맞게 수정하세요

function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/posts/${postId}`);
        setPost(response.data);
        setLikes(response.data.likes); // 좋아요 개수만 설정  || 0
        setComments(response.data.comments || []); // 댓글 목록을 서버에서 불러오기
      } catch (error) {
        console.error('게시글 상세 정보 가져오기 오류:', error);
      }
    };
    // 댓글   
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/comments/${postId}`);
        setComments(response.data); // 댓글을 comments 상태에 저장
      } catch (error) {
        console.error('댓글 가져오기 오류:', error);
      }
    };

    fetchPostDetail(); // 게시글 상세정보 가져오기 
    fetchComments(); // 댓글 목록 가져오기
  }, [postId]); // postId가 변경될 때마다 게시글 정보 가져오기

  // 좋아요 
  const handleLikeToggle = async () => {
    try {
      const url = `http://localhost:3000/posts/${postId}/${isLiked ? 'unlike' : 'like'}`;
      const response = await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("서버에서 받은 좋아요 개수:", response.data.likes); // 서버에서 받은 좋아요 개수 확인
      setLikes(response.data.likes); // 최신 좋아요 개수로 업데이트
      setIsLiked(!isLiked); // 좋아요 상태 변경
    } catch (error) {
      console.error('좋아요 상태 변경 오류:', error);
    }
  };

  const handleCommentChange = (e) => setNewComment(e.target.value);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `http://localhost:3000/comments/${postId}`,
          { content: newComment },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setComments([...comments, response.data]); // 댓글 상태 업데이트
        setNewComment(''); // 입력 필드 초기화
      } catch (error) {
        console.error('댓글 추가 오류:', error);
      }
    };

  if (!post) return <p>게시글을 불러오는 중입니다...</p>;

  return (
    <div className="post-detail">
      <img src={post.images[0]} alt="Post" className="post-detail-image" />
      <div className="post-detail-info">
        <p className="post-author">@ {post.author?.username}</p>
        <p className="post-date">작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
        <p className="post-content">{post.content}</p>
        
        {/* 좋아요 섹션 */}
        <div className="like-section">
          <button onClick={handleLikeToggle} className="like-button">
            <img src={fireIcon} alt="Like" className="like-icon" />
          </button>
          <span>{likes} Likes</span>
        </div>
        
        {/* 댓글 섹션 */}
        <div className="comments-section">
          <div className="comment-list">
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                <p><strong>{comment.author?.username || '작성자 로딩중..'}</strong>: {comment.content}</p>
              </div>
            ))}
          </div>
          <div className="comment-form">
            <input
              type="text"
              value={newComment}
              onChange={handleCommentChange}
              placeholder="댓글을 입력하세요..."
            />
            <button onClick={handleCommentSubmit}>댓글 달기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;