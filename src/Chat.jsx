import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Chat() {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const jwtToken = localStorage.getItem('userToken');

  const decodeToken = (token) => {
    try {
      const decodedJwt = JSON.parse(atob(token.split('.')[1]));
      return decodedJwt;
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      return null;
    }
  };

  // Fake messages array with Master Chief's avatar
  const fakeMessages = [
    { text: "Captian Keyes ~ Halo: Combat Evolved", name: "Master Chief", avatar: "https://pbs.twimg.com/profile_images/1487458038479003651/QaaBLRjC_400x400.jpg" },
    { text: "I need a weapon ~ Halo 2", name: "Master Chief", avatar: "https://pbs.twimg.com/profile_images/1487458038479003651/QaaBLRjC_400x400.jpg" },
    { text: "Wake me, when you need me ~ Halo 3", name: "Master Chief", avatar: "https://pbs.twimg.com/profile_images/1487458038479003651/QaaBLRjC_400x400.jpg" },
    { text: "We all make mistakes ~ Halo Infinite", name: "Master Chief", avatar: "https://pbs.twimg.com/profile_images/1487458038479003651/QaaBLRjC_400x400.jpg" }
  ];

  const getMessages = async () => {
    fetch('https://chatify-api.up.railway.app/messages', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + jwtToken,
            'Content-Type': 'application/json',
        },
    })
        .then(res => {
            if (!res.ok) {
                console.error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            setMessages(data);
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
  };

  useEffect(() => {
    if (jwtToken) {
      const decodeUser = decodeToken(jwtToken);
      if (decodeUser) {
        setUser(decodeUser);
        localStorage.setItem('user', JSON.stringify(decodeUser));
      }
    }
    // Show initial fake messages
    setMessages(fakeMessages);

    // Fetch actual messages after a slight delay (simulating loading effect)
    setTimeout(() => {
      getMessages();
    }, 3000);
  }, [jwtToken]);

  // Function to trigger a random fake response from Master Chief
  const triggerFakeResponse = () => {
    const randomMessage = fakeMessages[Math.floor(Math.random() * fakeMessages.length)];
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, randomMessage]);
    }, 2000); // Delay fake response by 2 seconds
  };

  const sendMessage = async () => {
    const sanitizedInput = input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const newMessage = { text: sanitizedInput, name: user?.user, avatar: user?.avatar };

    try {
      const response = await fetch('https://chatify-api.up.railway.app/messages', 
        { method: 'POST', headers: {
          'Content-Type': 'application/json', 
          Authorization: 'Bearer ' + jwtToken,
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        console.error('Failed to send message');
        return;
      }

      const createdMessage = await response.json();
      setMessages([...messages, { ...createdMessage.latestMessage, name: user?.user, avatar: user?.avatar }]);
      setInput('');

      // Trigger a random fake response after sending a message
      triggerFakeResponse();

    } catch (error) {
      console.error('There was a problem with sending your message:', error);
    }
  };

  const deleteMessage = async (msg) => {
    if (confirm("Are you sure?") === true) {
      if (msg.id) {
        // Handle real messages (messages with an ID)
        try {
          const response = await fetch(`https://chatify-api.up.railway.app/messages/${msg.id}`,
            {
              method: 'DELETE',headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwtToken,
              },
            });
    
          if (!response.ok) {
            console.error('Failed to delete message');
            return;
          }
          setMessages(messages.filter((message) => message.id !== msg.id));
        } catch (error) {
          console.error('There was a problem with deleting your message:', error);
        }
      } else {
        // Handle fake messages (messages without an ID)
        setMessages(messages.filter((message) => message !== msg));
      }
    }
  };

  const nextRegister = () =>
    {
      navigate('/register');
    };

  const nextLogin = () =>
    {
      navigate('/login');
    };

  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        left: 0,
        width: "100%",
        height: "93%",
        backgroundImage:
          "url(https://wallpapercat.com/w/full/3/b/3/728251-3840x2160-desktop-4k-halo-ring-background-image.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        alignItems: "center",
      }} >
    <div className="hero-overlay bg-opacity-60 absolute top-0 left-0 w-full h-full"></div>
    <div className="p-4 bg-opacity-70 backdrop-blur-lg">
    <div className="space-y-4">
    <div className="chat-header">
        {user ? (
          <h2>Welcome, {user.user}!</h2>
        ) : (
          <button type="button" className="btn btn-warning" onClick={nextRegister}>Don't have an account? Register to chat!</button>
        )}
        <br />
        {user ? (
          <h2></h2>
        ) : (
          <button type="button" className="btn btn-warning mt-4" onClick={nextLogin}>Already have an account? Log in to chat!</button>
        )}
      </div>
      {messages.map((msg, index) => (
        <div key={index} className={`chat ${msg.name === user?.user ? 'chat-end' : 'chat-start'}`}>
          <div className="chat-image avatar">
            <div className="w-14 rounded-full">
              <img 
                alt="Avatar" 
                src={msg.name === user?.user ? user?.avatar : msg.avatar || "https://via.placeholder.com/150"} 
              /> {/* Show user's avatar if message is from the user, otherwise show Master Chief's or fallback avatar */}
            </div>
          </div>
          <div className="chat-header my-2 px-2">
            {msg.name}
          </div>
          <div className="flex items-center">
          <div className="chat-bubble text-white">{msg.text}</div>
          <button className="text-xs text-black-500 ml-4 btn btn-warning" onClick={() => deleteMessage(msg)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
    <div className="flex mt-4">
      <input className="input input-bordered w-full" value={input} onChange={(e) => setInput(e.target.value)} placeholder="send message..." />
      <button className="btn ml-2 btn-warning" onClick={sendMessage}>Send</button>
    </div>
  </div>
</div>
);
}

export default Chat;