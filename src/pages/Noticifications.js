import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../css/Notification.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('알림 가져오기 오류:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notification-page">
      {/* <h2>알림</h2> */}
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification._id} className="notification">
            <p>
              <strong>{notification.userId.username}</strong> 님이{' '}
              {notification.type === 'like' ? '게시글에 좋아요를 눌렀습니다' : '게시글에 댓글을 남겼습니다'}.
            </p>
            <p>게시글: {notification.postId.content}</p>
            <p>{new Date(notification.createdAt).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>알림이 없습니다.</p>
      )}
    </div>
  );
};

export default Notifications;