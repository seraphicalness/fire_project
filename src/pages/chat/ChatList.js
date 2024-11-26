import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/chat/Chat.css';

// onSelectChatRoom: 부모 컴포넌트에서 전달된 함수로, 클릭한 채팅방의 정보를 전달
const ChatList = ({ onSelectChatRoom }) => {
    console.log("onSelectChatRoom의 타입:", typeof onSelectChatRoom); // "function"이어야 정상
    
  const [chatRooms, setChatRooms] = useState([]);
  const [newChatRoomName, setNewChatRoomName] = useState('');
  const [participants, setParticipants] = useState(''); // 참여자 이름 입력 (쉼표로 구분)
//   const [otherUserId] = useState(''); // 상대방 사용자 ID 상태 추가
//   const loggedInUserId = JSON.parse(localStorage.getItem('userInfo'))?.userId; // 로컬스토리지에서 사용자 ID 가져오기


// 채팅방 목록 조회 
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/chat/chat-rooms', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatRooms(response.data);
      } catch (error) {
        console.error('채팅방 목록 조회 오류:', error);
      }
    };

    fetchChatRooms();
  }, []);

    // 중복 제거
    const uniqueChatRooms = chatRooms.filter(
        (room, index, self) => index === self.findIndex((r) => r._id === room._id)
      );

  // 채팅방 생성 
  const createChatRoom = async () => {
    if (!newChatRoomName.trim() || !participants.trim()) {
      alert('채팅방 이름과 참여자를 입력해주세요.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const participantIds = participants
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p); // 빈 값 또는 null 제거
  
      if (participantIds.length === 0) {
        alert('유효한 참여자를 입력해주세요.');
        return;
      }
  
      const response = await axios.post(
        'http://localhost:3000/chat/create',
        {
          name: newChatRoomName,
          participants: participants.split(',').map((p) => p.trim()), // 쉼표로 구분된 참여자 이름
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setChatRooms((prev) => [...prev, response.data]); // 새 채팅방 추가
      setNewChatRoomName('');
      setParticipants('');
    } catch (error) {
      console.error('채팅방 생성 오류:', error);
      alert('채팅방 생성에 실패했습니다.');
    }
  };

  return (
    <div className="chat-list">
      <h2>채팅방 목록</h2>
      {uniqueChatRooms.map((room) => (
        <div key={room._id} className="chat-room" onClick={() => onSelectChatRoom(room)}>
          <h3>{room.name}</h3>
          {room.participants && room.participants.length > 0 ? (
            <p>참여자: {room.participants.map((p) => p?.username || '알 수 없는 사용자').join(', ')}</p>
          ) : (
            <p>참여자가 없습니다.</p>
          )}
        </div>
))}

      <div className="create-chat-room">
        <input
          type="text"
          placeholder="채팅방 이름"
          value={newChatRoomName}
          onChange={(e) => setNewChatRoomName(e.target.value)}
        />
        <input
          type="text"
          placeholder="참여자 ID (쉼표로 구분)"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
        />
        <button onClick={createChatRoom}>채팅방 생성</button>
      </div>
    </div>
  );
};

export default ChatList;