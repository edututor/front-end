import React from 'react';
import '../styles/Home.css';

const DocumentsComponent = ({ handleDocumentUpload }) => {
  return (
    <div className="documents-container">
      <h2>Documents</h2>
      <ul>
        <li>Document 1</li>
        <li>Document 2</li>
        <li>Document 3</li>
        <li>Document 4</li>
      </ul>
      {/* Simple file input for demonstration */}
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            handleDocumentUpload(file);
          }
        }}
      />
    </div>
  );
};

export default DocumentsComponent;
