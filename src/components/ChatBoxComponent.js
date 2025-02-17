import React from 'react';
import '../styles/Home.css';

const ChatBoxComponent = () => {
  return (
    <>
      <h2>Chat Box</h2>
      <div style={{ flex: 1, border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
        <p>AI Response</p>
        <p>User Response</p>
        <p>AI Response</p>
        <p>User Response</p>
      </div>
      <input type="text" placeholder="Type Something" style={{ padding: '5px' }} />
    </>
  );
};

export default ChatBoxComponent;
