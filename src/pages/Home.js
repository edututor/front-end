import React from 'react';
import '../styles/Home.css';
import ChatBoxComponent from '../components/ChatBoxComponent';
import QuizzesComponent from '../components/QuizzesComponent';
import DocumentsComponent from '../components/DocumentsComponent';

const Home = () => {
  const handleDocumentUpload = async (file) => {
    // Implement document upload logic here
    console.log('Uploading file:', file);
  };

  return (
    <div className="home-container">
      <div className='main-container'>
        {/* Left: Chat Box */}
        <div className="chat-box-container">
          <ChatBoxComponent />
        </div>
        {/* Right: Documents (top) & Quizzes (bottom) */}
        <div className="right-side">
          <DocumentsComponent handleDocumentUpload={handleDocumentUpload} />
          <QuizzesComponent />
        </div>
      </div>
    </div>
  );
};

export default Home;
