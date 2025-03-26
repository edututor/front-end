import React, { useState, useEffect } from 'react';
import '../styles/ChatBox.css';

const ChatBoxComponent = ({ selectedDocument }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    // Clear chat when document changes
    setMessages([]);
    if (selectedDocument) {
      setMessages([{
        type: 'ai',
        content: `Now chatting with document: ${selectedDocument.name}`
      }]);
    } else {
      setMessages([{
        type: 'ai',
        content: 'Please select a document to start chatting.'
      }]);
    }
  }, [selectedDocument]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    if (!selectedDocument) {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'Please select a document first.'
      }]);
      return;
    }

    const userMessage = { type: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      // API call to chat service would go here
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: selectedDocument.id,
          message: inputMessage
        })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { type: 'ai', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'Sorry, there was an error processing your message.'
      }]);
    }
  };

  return (
    <div className={`chat-box-wrapper ${!selectedDocument ? 'no-document' : ''}`}>
      <div className="chat-header">
        <h2>Chat Box</h2>
        {selectedDocument && (
          <span className="selected-document">
            Current: {selectedDocument.name}
          </span>
        )}
      </div>

      <div className="chat-messages">
        {!selectedDocument && (
          <div className="upload-prompt">
            <p>Please select a document from the sidebar to start chatting.</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}-message`}>
            {message.content}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={selectedDocument ? "Type your message here..." : "Select a document to start chatting"}
          className="chat-input"
          disabled={!selectedDocument}
        />
        <button 
          onClick={handleSendMessage} 
          className="send-button"
          disabled={!selectedDocument}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBoxComponent;