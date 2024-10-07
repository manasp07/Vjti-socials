import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import axios from 'axios';

const ChatPage = () => {
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState({});
  const [currentFriend, setCurrentFriend] = useState(null);
  const [message, setMessage] = useState('');
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const socketRef = useRef();

  useEffect(() => {
    axios.get(`http://localhost:3001/users/${user._id}/friends`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(response => {
      setFriends(response.data);
    }).catch(error => {
      console.error('Error fetching friends:', error);
    });

    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      console.log('Connected to socket');
    });

   socketRef.current.on('message', (newMessage) => {
       setMessages(prevMessages => ({
         ...prevMessages,
         [newMessage.sender]: [...(prevMessages[newMessage.sender] || []), newMessage],
         [newMessage.recipient]: [...(prevMessages[newMessage.recipient] || []), newMessage],
       }));
     });

    return () => {
      socketRef.current.disconnect();
    };
  }, [token, user._id]);

  const sendMessage = () => {
    if (!currentFriend || !message) return;

    const msg = {
      userId: user._id,
      friendId: currentFriend._id,
      text: message,
    };

    socketRef.current.emit('message', msg);
    setMessage('');
  };

  const handleFriendClick = (friend) => {
    setCurrentFriend(friend);
    const roomId = [user._id, friend._id].sort().join('_');
    socketRef.current.emit('join', { roomId });
  };

  return (
    <div className="chat-page">
      <div className="friends-list">
        {friends.map(friend => (
          <div key={friend._id} onClick={() => handleFriendClick(friend)}>
            {friend.firstName} {friend.lastName}
          </div>
        ))}
      </div>
      <div className="chat-area">
        {currentFriend && (
          <>
            <div className="messages">
              {(messages[currentFriend._id] || []).map((msg, index) => (
                <div key={index}>
                  <strong>{msg.sender === user._id ? 'You' : currentFriend.firstName}</strong>: {msg.text}
                </div>
              ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
