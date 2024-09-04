import React, { useState, useEffect } from "react";

// State hook för att hantera chatkomponenten
function Chat() {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
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
      const response = await fetch('https://chatify-api.up.railway.app/messages', { method: 'POST', headers: {
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
  const deleteMessage = async (msgId) => {
    try {
      const response = await fetch(`https://chatify-api.up.railway.app/messages/${msgId}`, { method: 'DELETE', headers: {
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
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          // <div key={index} style={{ textAlign: msg.email === user?.email ? 'right' : 'left' }}>
          //   <span>{msg.text}</span>
          //   {msg.email === user?.email && (
          //     <button onClick={() => deleteMessage(msg.id)}>Radera</button>
          //   )}
          // </div>
          <>{msg.text}</>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Skicka</button>
    </div>
  );
}

export default Chat;