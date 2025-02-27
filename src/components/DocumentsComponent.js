import React, { useState } from 'react';
import '../styles/Documents.css';

const DocumentsComponent = ({ onSelectDocument, selectedDocument }) => {
  // Pre-loaded documents
  const preloadedDocuments = [
    { id: 1, name: "Introduction to React" },
    { id: 2, name: "JavaScript Basics" },
    { id: 3, name: "Python Programming" },
    { id: 4, name: "Data Structures" }
  ];

  return (
    <div className="documents-section">
      <h2>Documents</h2>
      <div className="documents-list">
        {preloadedDocuments.map((doc) => (
          <div 
            key={doc.id}
            className={`document-item ${selectedDocument?.id === doc.id ? 'selected' : ''}`}
            onClick={() => onSelectDocument(doc)}
          >
            <span>{doc.name}</span>
            <button 
              className={`view-doc-btn ${selectedDocument?.id === doc.id ? 'selected' : ''}`}
            >
              {selectedDocument?.id === doc.id ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsComponent;
