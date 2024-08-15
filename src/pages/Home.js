import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import axiosInstance from '../api/Axios';
import ChatWindow from './ChatWindow';

const Home = () => {
    const { setAuth } = useContext(AuthContext);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatId, setChatId] = useState(null);


    const toggleChat = async () => {
        if (!isChatOpen) {
            try {
                const response = await axiosInstance.get('/Chat');
                const chatData = response.data;
                setChatId(chatData.chatId);
            } catch (error) {
                console.error('Failed to fetch chat data:', error);
            }
        }
        setIsChatOpen(prev => !prev);
    };

    return (
        <div>
            <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8f9fa' }}>
                <h2>Home</h2>
            </nav>

            <div style={{ padding: '20px' }}>
                <button onClick={toggleChat}>
                    {isChatOpen ? 'Close Chat' : 'Open Chat'}
                </button>

                {isChatOpen && (
                    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
                        <ChatWindow chatId={chatId} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
