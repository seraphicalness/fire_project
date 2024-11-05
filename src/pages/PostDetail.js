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
        setLikes(response.data.likes || 0);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error('게시글 상세 정보 가져오기 오류:', error);
      }
    };
    fetchPostDetail();
  }, [postId]);

  const handleLike = () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  const handleCommentChange = (e) => setNewComment(e.target.value);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`http://localhost:3000/posts/${postId}/comments`, { content: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
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
          <button onClick={handleLike} className="like-button">
            <img src={fireIcon} alt="Like" className="like-icon" />
          </button>
          <span>{likes} Likes</span>
        </div>
        
        {/* 댓글 섹션 */}
        <div className="comments-section">
          <div className="comment-list">
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                <p><strong>{comment.author?.username || '익명'}</strong>: {comment.content}</p>
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