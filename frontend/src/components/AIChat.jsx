import React, { useState } from 'react';

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

    // Simulating an AI response
    const aiResponse = {
      id: messages.length + 2,
      text: `AI Response to: "${input}"`,
      sender: 'ai'
    };

    // Update conversation
    setMessages([...messages, newMessage, aiResponse]);
    setInput(''); // Clear input after sending
  };

  return (
    <><div style={{ textAlign: "center" }}>
          <h3>Ask the AI</h3>
      </div><div className="chat-container" style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
              <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                  {messages.map(message => (
                      <div key={message.id} style={{ textAlign: message.sender === 'user' ? 'right' : 'left', margin: '5px' }}>
                          <div style={{ display: 'inline-block', padding: '8px', backgroundColor: message.sender === 'user' ? '#d1ecf1' : '#f8d7da', borderRadius: '12px', whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '80%' }}>
                              {message.text}
                          </div>
                      </div>
                  ))}
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
                  <textarea
                      value={input}
                      onChange={handleInputChange}
                      style={{ flexGrow: 1, marginRight: '5px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', resize: 'none', minHeight: '50px', overflow: 'auto' }} />
                  <button type="submit" style={{ padding: '10px 20px', border: 'none', borderRadius: '8px', backgroundColor: '#007bff', color: 'white' }}>
                      Send
                  </button>
              </form>
          </div></>
  );
};

export default ChatComponent;
