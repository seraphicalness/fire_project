import React, { useState } from "react";
import ChatList from "./ChatList.js";
import ChatRoom from "./ChatRoom.js";
import '../../css/chat/Chat.css';

// •	ChatList: 채팅방을 선택하거나 생성합니다.
// •	ChatRoom: 선택된 채팅방의 메시지를 표시하고 전송합니다.
// •	ChatPage: ChatList와 ChatRoom을 연결합니다.

// ChatList, ChatRoom을 연결하는 부모 컴포넌트 역할 
const ChatPage = () => {
    // ChatList에서 선택된 채팅방 정보를 selectedChat 상태로 저장 
  const [selectedChat, setSelectedChat] = useState(null);  // 선택된 채팅방 

  console.log("선택된 채팅방:", selectedChat); // 선택된 채팅방 상태 확인

  return (
    <div className="chat-page">
    <ChatList onSelectChatRoom={(room) => setSelectedChat(room)} />
    {selectedChat && <ChatRoom chatId={selectedChat._id} />}
    </div>
    // <div className="chat-page">
    //   <ChatList onSelectChat={setSelectedChat} />
    //   {selectedChat && <ChatRoom chatId={selectedChat} />}
    // </div>
  );
};

export default ChatPage;