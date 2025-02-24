import React, { useState } from 'react';
import '../styles/Home.css';
import ChatBoxComponent from '../components/ChatBoxComponent';
import QuizzesComponent from '../components/QuizzesComponent';
import DocumentsComponent from '../components/DocumentsComponent';

const Home = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [refreshDocs, setRefreshDocs] = useState(false);

  const handleDocumentUpload = async (file, onProgress) => {
    // Handle document upload logic here
    // After successful upload, trigger documents refresh
    setRefreshDocs(prev => !prev);
  };

  const handleSelectDocument = (document) => {
    setSelectedDocument(document);
  };

  return (
    <div className="home-container">
      <div className="main-container">
        <div className="chat-box-container">
          <ChatBoxComponent 
            selectedDocument={selectedDocument}
            onDocumentUpload={handleDocumentUpload}
          />
        </div>
        <div className="right-side">
          <DocumentsComponent 
            onSelectDocument={handleSelectDocument}
            selectedDocument={selectedDocument}
            onRefresh={refreshDocs}
          />
          <QuizzesComponent 
            selectedDocument={selectedDocument}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
