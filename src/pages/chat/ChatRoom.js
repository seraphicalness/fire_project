import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../css/chat/Chat.css';

const ChatRoom = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const loggedInUserId = JSON.parse(localStorage.getItem("userInfo"))?.userId; // 로그인한 사용자 ID

  // 메시지 조회
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/message/${chatId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("메시지 가져오기 오류:", error);
      }
    };

    if (chatId) fetchMessages();
  }, [chatId]);

  // 메시지 전송
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3000/message/${chatId}`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, response.data]); // 새 메시지 추가
      setNewMessage("");
    } catch (error) {
      console.error("메시지 전송 오류:", error);
    }
  };

  return (
    <div className="chat-room">
  <div className="message-list">
    {messages.length > 0 ? (
      messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.senderId === loggedInUserId ? "sent" : "received"}`}
        >
          <div className="username">
            {msg?.senderId?.username || "알 수 없는 사용자"}:
          </div>
          <div className="content">
            {msg.content}
          </div>
        </div>
      ))
    ) : (
      <p>메시지가 없습니다.</p>
    )}
  </div>
  <div className="message-input">
    <input
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder="메시지를 입력하세요..."
    />
    <button onClick={sendMessage}>전송</button>
  </div>
</div>
  );
};

export default ChatRoom;