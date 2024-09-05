import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// State hook för att hantera chatkomponenten
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

  // Hämtar användarinformation från localStorage när komponenten laddas
  useEffect(() => {
    if (jwtToken) {
      const decodeUser = decodeToken(jwtToken);
      if (decodeUser) {
        setUser(decodeUser);
        localStorage.setItem('user', JSON.stringify(decodeUser));
      }
    }
    getMessages();
  }, [jwtToken]);

  // Skickar ett meddelande
  const sendMessage = async () => {
    const sanitizedInput = input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const newMessage = { text: sanitizedInput, conversationId: null };

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
      setMessages([...messages, createdMessage.latestMessage]);
      setInput('');
    } catch (error) {
      console.error('There was a problem with sending your message:', error);
    }
  };

  // TODO: Börja lyssna på Sebbe.
  // TODO2: Om du ska använda ChatGPT, ställ åtminstone frågan vad fan som sker i koden din.
  const deleteMessage = async (msgId) => {
    if (confirm("Are you sure?") === true) {
      try {
        const response = await fetch(`https://chatify-api.up.railway.app/messages/${msgId}`,
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
        setMessages(messages.filter((msg) => msg.id !== msgId));
      } catch (error) {
        console.error('There was a problem with deleting your message:', error);
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
      <div style={{
        position: "absolute",
        top: 63,
        left: 0,
        width: '100%',
        height: '100vh',
          backgroundImage: "url(https://c4.wallpaperflare.com/wallpaper/165/383/672/halo-video-games-halo-infinite-xbox-wallpaper-preview.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} >
          <div className=" w-full">
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="p-4 bg-opacity-70 backdrop-blur-lg">
          <div className="space-y-4">
          <div className="chat-header">
              {user ? (
                <h2>Welcome, {user.user}!</h2>
              ) : (
                <button type="button" className="btn btn-link" onClick={nextRegister}>Register to chat!</button>
              )}
              <br />
              {user ? (
                <h2></h2>
              ) : (
                <button type="button" className="btn btn-link" onClick={nextLogin}>Log in to chat!</button>
              )}
            </div>
            {messages.map((msg, index) => (
              <div key={index} className={`chat ${msg.email === user?.email ? 'chat-end' : 'chat-start'}`}>
                <div className="chat-image avatar">
                  <div className="w-14 rounded-full">
                  <img alt="Avatar" src={user.avatar} />
                  </div>
                </div>
                <div className="chat-header my-2 px-2">
                {user ? (
                <h2>{user.user}!</h2>
              ) : (
                <h2>username</h2>
              )}
                </div>
                {msg.email === user?.email ? user?.username || "You" : msg.email}
                <div className="flex items center">
                <div className="chat-bubble text-white">{msg.text}</div>
                <button className="text-xs text-black-500 ml-4 btn btn-warning" onClick={() => deleteMessage(msg.id)} >Delete</button>
                </div>
                </div>
            ))}
          </div>
          <div className="flex mt-4">
            <input className="input input-bordered w-full" value={input} onChange={(e) => setInput(e.target.value)} placeholder="send message..." />
            <button className="btn ml-2 btn btn-warning" onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
      </div>
    );
  }
  

export default Chat;