// import { Input } from "antd";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io('http://localhost:8000'); 

// const Chat = () => {
//   const buyerId = "6722cf7833cd6795c856d707";
//   const sellerId = "671882d174e5f921327ffa50";
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const chatRoomId = "6722e11133cd6795c856d74d"; // Use your specific chatRoomId here

//   // Fetch all messages when component mounts
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8000/api/v1/chat/messages/${chatRoomId}`);
//         setMessages(response.data); // Set fetched messages to state
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();

//     // Listen for incoming messages via socket
//     socket.on('receive_message', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       socket.off('receive_message');
//     };
//   }, [chatRoomId]);

//   const sendMessage = async () => {
//     const messageData = {
//       chatRoomId,
//       senderId: buyerId,
//       message: newMessage,
//     };

//     try {
//       await axios.post('http://localhost:8000/api/v1/chat/send-message', messageData);

//       // Emit the message via socket
//       socket.emit('send_message', messageData);

//       // Add the sent message to the messages state
//       setMessages((prevMessages) => [...prevMessages, messageData]);

//       setNewMessage(''); // Clear input field
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center w-full mt-10">
//       <div>
//         {messages.map((msg, index) => (
//           <div key={index}>
//             <strong>{msg.senderId}: </strong>
//             <span>{msg.message}</span>
//           </div>
//         ))}
//       </div>
//       <Input
//         type="text"
//         value={newMessage}
//         onChange={(e) => setNewMessage(e.target.value)}
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// };

// export default Chat;
