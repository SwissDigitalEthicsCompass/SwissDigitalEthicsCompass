import React, { useState } from 'react';
import "../styles/AIChat.css";
import api from '../api';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // State to handle loading spinner

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim()) return; // Prevents sending empty messages

    const newMessage = {
      id: messages.length + 1,
      text: 'You: ' + input,
      sender: 'user',
    };

    setMessages([...messages, newMessage]); // Add user's message immediately
    setLoading(true); // Show loading spinner

    try {
      const response = await api.post("api/chat/", {
        input: input, // Pass the form data here
      });

      if (response.status === 200) {
        const { ai, image } = response.data;
        
        // AI text response
        const aiResponse = {
          id: messages.length + 2,
          text: `AI: "${ai}"`,
          sender: 'ai',
        };

        // AI image response
        const aiImage = image
          ? {
              id: messages.length + 3,
              image, // Store Base64 string
              sender: 'ai',
            }
          : null;

        setMessages((prevMessages) =>
          aiImage
            ? [...prevMessages, aiResponse, aiImage]
            : [...prevMessages, aiResponse]
        );
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Hide spinner after response
    }

    setInput(''); // Clear input after sending
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h4>Ask the AI</h4>
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
            >
              {message.text && (
                <div className="message-content">
                  {message.text}
                </div>
              )}
              {message.image && (
                <div className="message-content">
                  <img
                    src={`data:image/png;base64,${message.image}`}
                    alt="AI-generated"
                    style={{ maxWidth: "100%", borderRadius: "8px" }}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Loading spinner */}
          {loading && (
            <div className="message ai-message">
              <div className="message-content">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Do you have a question? Type here!"
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