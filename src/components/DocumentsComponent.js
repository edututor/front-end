import React, { useState, useEffect } from 'react';
import '../styles/Home.css';

const DocumentsComponent = ({ handleDocumentUpload }) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:8002/api/documents');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDocuments(data.list_of_names);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="documents-container">
      <h2>Documents</h2>
      <ul>
        <li>Document 1</li>
        <li>Document 2</li>
        <li>Document 3</li>
        <li>Document 4</li>
      </ul>
      {isLoading ? (
        <p>Loading documents...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <ul>
            {documents.length > 0 ? (
              documents.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))
            ) : (
              <p>No documents found</p>
            )}
          </ul>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                handleDocumentUpload(file);
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default DocumentsComponent;
