import React, { useState } from 'react';
import styled from 'styled-components';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 600px;
  margin: auto;
`;

const ChatBox = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-sizing: border-box;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  margin: 5px 0;
`;

const MessageLabel = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: #555;
  margin-bottom: 2px;
`;

const MessageBubble = styled.div`
  display: inline-block;
  padding: 8px 12px;
  background-color: ${(props) => (props.isUser ? '#d1ecf1' : '#f8d7da')};
  border-radius: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 80%;
`;

const Form = styled.form`
  display: flex;
  width: 100%;
`;

const TextArea = styled.textarea`
  flex-grow: 1;
  margin-right: 5px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  min-height: 50px;
  max-height: 150px;
  overflow: auto;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: `You: ` + input,
      sender: 'user',
    };

    const aiResponse = {
      id: messages.length + 2,
      text: `GenAI: "${input}"`,
      sender: 'ai',
    };

    setMessages([...messages, newMessage, aiResponse]);
    setInput('');
  };

  return (
    <ChatContainer>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h4>Ask the AI</h4>
      </div>
      <ResizableBox width={300} height={200} minConstraints={[200, 100]} maxConstraints={[600, 400]}>
        <ChatBox>
          {messages.map((message) => (
            <Message key={message.id} isUser={message.sender === 'user'}>
              <MessageBubble isUser={message.sender === 'user'}>
                {message.text}
              </MessageBubble>
            </Message>
          ))}
        </ChatBox>
      </ResizableBox>
      <Form onSubmit={handleSubmit}>
        <TextArea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <SubmitButton type="submit">Send</SubmitButton>
      </Form>
    </ChatContainer>
  );
};

export default ChatComponent;
