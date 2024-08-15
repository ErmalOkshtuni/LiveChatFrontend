import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';

import axiosInstance from '../api/Axios';

const AdminDashboard = () => {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axiosInstance.get('/CompanyChat/chats', {
          withCredentials: true
        });
        console.log(response);
        setChats(response.data);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    };

    fetchChats();
  }, []);

  const handleChatClick = (chatId) => {
    setSelectedChatId(chatId);
  };

  return (
    <div>
      <nav>
      </nav>
      <div className="admin-dashboard">
        <div className="chat-list">
          <h2>All Chats</h2>
          {chats.length === 0 ? (
            <p>No chats available.</p>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${chat.id === selectedChatId ? 'active' : ''}`}
                onClick={() => handleChatClick(chat.id)}
              >
                <div><strong>User:</strong> {chat.userName}</div>
                <div><strong>Last Message:</strong> {chat.lastMessage}</div>
                <div><strong>Timestamp:</strong> {chat.timestamp}</div>
              </div>
            ))
          )}
        </div>

        <div className="chat-window-container">
          {selectedChatId ? (
            <ChatWindow chatId={selectedChatId} setChatId={setSelectedChatId} />
          ) : (
            <p>Select a chat to view messages</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
