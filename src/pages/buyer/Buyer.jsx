import React, { useEffect, useState } from 'react';
import { useGetAllFlowersQuery } from '../../services/flowerApi';
import "./Buyer.css";
import { BE_API_LOCAL } from '../../config';
import { Button, Input, message, Row } from 'antd';
import { io } from 'socket.io-client';
import axios from 'axios';
import { CloseOutlined } from '@ant-design/icons';
import { useGetAllUserQuery } from '../../services/userAPI';
import { useCreateChatMutation } from '../../services/chatApi';

const socket = io('http://localhost:8000'); 

const Buyer = () => {
    const { data: flowers } = useGetAllFlowersQuery();
    const { data: users } = useGetAllUserQuery();
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedChatRoom, setSelectedChatRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const currentUser = sessionStorage.getItem("userId");
  const [createChat, { isLoading: loadingCreateChat }] = useCreateChatMutation();

    useEffect(() => {
        // Fetch all chat rooms on mount
        const fetchChatRooms = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/chat/rooms`);
                setChatRooms(response.data);
            } catch (error) {
                console.error("Error fetching chat rooms:", error);
            }
        };
        fetchChatRooms();
        
    }, []);

  

    const selectChatRoom = async (chatRoomId) => {
        setSelectedChatRoom(chatRoomId);
    };
    useEffect(() => {
        if (!selectedChatRoom) return;

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/chat/messages/${selectedChatRoom}`);
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        socket.on('receive_message', (message) => {
            if (message.chatRoomId === selectedChatRoom) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });

        return () => {
            socket.off('receive_message');
        };
    }, [selectedChatRoom]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedChatRoom) return;

        const messageData = {
            chatRoomId: selectedChatRoom,
            senderId: currentUser,
            message: newMessage,
        };

        try {
            await axios.post('http://localhost:8000/api/v1/chat/send-message', messageData);
            setMessages((prevMessages) => [...prevMessages, messageData]);
            setNewMessage('');
            socket.emit('send_message', messageData);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    const getUserNameById = (userId) => {
        const user = users?.find((user) => user._id === userId);
        return user ? user.name : "Unknown User";
    };

    const createChatRoom = async (sellerId) => {
        try {
            console.log(sellerId)
          const response =  await createChat({buyerId: currentUser, sellerId}).unwrap();
          console.log(response)
          setSelectedChatRoom(response._id)
          message.success("Chat created successfully!");
        } catch (error) {
          message.error("Failed to create order: " + (error.data?.message || "An unknown error occurred"));
        }
      };
console.log(flowers)
    return (
        <div className='flex flex-col items-center w-full mt-10'>
            <h2 className="text-2xl font-semibold mb-6">Our Bouquets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                {flowers?.map((flower) => (
                    <div key={flower.id} className="flex flex-col items-center text-center p-4 bg-[#F9F9F9] rounded-lg shadow-md">
                        <img 
                            src={`http://localhost:8000/${flower.imageUrl}`} 
                            alt={flower.name} 
                            className="w-[300px] h-[400px] object-cover rounded-md mb-4" 
                        />
                        <p className="font-medium text-lg">{flower.name}</p>
                        <p className="text-gray-600 font-light">FROM ${flower.price}</p>
                        <Button onClick={()=>{createChatRoom(flower?.sellerId?._id)}} size='large' style={{ width: "100%" }}>Liên hệ</Button>
                    </div>
                ))}
            </div>

            <div className="flower-background-container">
                    <div className="flower-background-content">
                        <h3 style={{color:"white", fontSize:"24px", fontWeight:"200"}}>About us</h3>
                        <p style={{color:"white", fontSize:"24px", fontWeight:"400", textAlign:'center'}}>Lorem ipsum dolor sit amet consectetur. Nunc tempus consequat senectus imperdiet est purus enim. Iaculis odio eget rutrum ultricies egestas. Sed sed eget vitae nulla dignissim pretium. Sollicitudin turpis orci eu sed morbi amet. Habitasse lobortis morbi aliquam turpis nam elit eget. Cras nisi facilisis consequat eget elementum morbi. Dui ut malesuada at vitae tortor. Facilisis morbi blandit amet amet ultrices. In sit sit at consectetur interdum. Fermentum condimentum amet sapien netus laoreet eu. Netus eu sagittis integer amet ipsum mauris. Eu elementum dapibus mattis pellentesque arcu. Augue in at at tincidunt quis id amet vitae. </p>
                    </div>
            </div>
            
            {/* Chat Room List */}
            <div className="chat-room-list">
                <Row style={{ justifyContent: "space-between" }}>
                    <h4 
                        style={{ width: "90%", cursor: "pointer" }} 
                        onClick={() => setVisible(!visible)}
                    >
                        Chat Rooms
                    </h4>
                    <CloseOutlined onClick={() => setVisible(false)} />
                </Row>
                {visible && (
                    <div className="chat-room-scroll">
                        {chatRooms.map((room) => (
                            <div 
                                key={room._id} 
                                className="chat-room-item"
                                onClick={() => selectChatRoom(room._id)}
                            >
                                <p>{getUserNameById(room.buyerId)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Chatbox UI */}
            {selectedChatRoom && (
                <div className="chatbox">
                    <div className="chatbox-header">
                        <h4>Chat Room</h4>
                        <CloseOutlined onClick={() => setSelectedChatRoom(null)} />
                    </div>
                    <div className="chatbox-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-bubble ${msg.senderId === currentUser ? 'sent' : 'received'}`}>
                                <strong>{getUserNameById(msg.senderId)}: </strong> {msg.message}
                            </div>
                        ))}
                    </div>
                    <div className="chatbox-input">
                        <Input 
                            placeholder="Type your message..." 
                            value={newMessage} 
                            onChange={(e) => setNewMessage(e.target.value)} 
                        />
                        <Button type="primary" onClick={sendMessage}>Send</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Buyer;
