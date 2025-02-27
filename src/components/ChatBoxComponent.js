import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatBox.css';

const ChatBoxComponent = ({ selectedDocument, onDocumentUpload }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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
        content: 'Please select an existing document or upload a new one to start chatting.'
      }]);
    }
  }, [selectedDocument]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    if (!selectedDocument) {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'Please select or upload a document first.'
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

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    try {
      await onDocumentUpload(file, (progress) => {
        setUploadProgress(progress);
      });
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'Document uploaded successfully! You can now start chatting.'
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'Failed to upload document. Please try again.'
      }]);
    }
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  return (
    <div 
      className={`chat-box-wrapper ${isDragging ? 'dragging' : ''} ${!selectedDocument ? 'no-document' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="chat-header">
        <h2>Chat Box</h2>
        {selectedDocument && (
          <span className="selected-document">
            Current: {selectedDocument.name}
          </span>
        )}
      </div>

      <div className="chat-messages">
        {!selectedDocument && !isUploading && (
          <div className="upload-prompt">
            <p>To get started:</p>
            <ul>
              <li>Drag and drop a document here</li>
              <li>Or click below to upload</li>
              <li>Or select an existing document from the sidebar</li>
            </ul>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.txt"
            />
            <button 
              className="upload-btn"
              onClick={() => fileInputRef.current.click()}
            >
              Upload Document
            </button>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}-message`}>
            {message.content}
          </div>
        ))}
        
        {isUploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p>Uploading: {uploadProgress}%</p>
          </div>
        )}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={selectedDocument ? "Type your message here..." : "Select or upload a document to start chatting"}
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
