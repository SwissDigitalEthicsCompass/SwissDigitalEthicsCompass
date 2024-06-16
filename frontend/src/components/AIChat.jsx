import React, { useState } from 'react';
import "../styles/AIChat.css"

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim()) return; // Prevents sending empty messages

    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user'
    };

    const aiResponse = {
      id: messages.length + 2,
      text: `AI Response to: "${input}"`,
      sender: 'ai'
    };

    setMessages([...messages, newMessage, aiResponse]);
    setInput(''); // Clear input after sending
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Ask the AI</h3>
      <div className="chat-container">
        <div className="messages-container">
          {messages.map(message => (
            <div key={message.id} className="message">
              <div className={`message-content ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}>
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

export default ChatComponent;
