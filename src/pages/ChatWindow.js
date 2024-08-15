import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import axiosInstance from '../api/Axios';

const ChatWindow = ({ chatId, setChatId }) => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId) {
        try {
          const response = await axiosInstance.get(`/api/Chat/${chatId}/messages`);
          setMessages(response.data);
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      }
    };

    fetchMessages();

    const connectToChat = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl('http://localhost:5232/chatHub', {
          accessTokenFactory: () => localStorage.getItem('token'),
        })
        .withAutomaticReconnect()
        .build();

      connection.on('ReceiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      try {
        await connection.start();
        setConnection(connection);
        if (chatId) {
          await connection.invoke('JoinChat', chatId);
        }
      } catch (error) {
        console.error('Connection failed:', error);
      }
    };

    connectToChat();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (connection && newMessage.trim()) {
      try {
        await connection.invoke('SendMessage', chatId || 0, newMessage);

        setNewMessage('');
      } catch (error) {
        console.error('Send message failed:', error);
      }
    }
  };

  return (
    <div className="chat-window">
      <header>
        <img src="/path-to-company-icon.png" alt="Company Logo" />
        <h2>Company Chat</h2>
      </header>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.Username}</strong>: {msg.content} <span>{msg.CreatedAt}</span>
          </div>
        ))}
      </div>
      <footer>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </footer>
    </div>
  );
};

export default ChatWindow;
