import React, { useState } from 'react';
import "../styles/AIChat.css"
import api from '../api';


const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim()) return; // Prevents sending empty messages

    const newMessage = {
      id: messages.length + 1,
      text: 'You: ' + input,
      sender: 'user'
    };

    try {
      const response = await api.post("api/chat/", {
        input: input, // Pass the form data here
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const aiResponse = {
          id: messages.length + 2,
          text: `AI: "${data.ai}"`,
          sender: 'ai'
        };
        setMessages([...messages, newMessage, aiResponse]);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setInput(''); // Clear input after sending
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h4>Ask the AI</h4>
      <div className="chat-container">
        <div className="messages-container">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}>
              <div className="message-content">
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder='Do you have a question? Type here!'
            className="chat-input"
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;