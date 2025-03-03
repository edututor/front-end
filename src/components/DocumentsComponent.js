import React, { useState, useEffect } from 'react';
import '../styles/Documents.css';

const DocumentsComponent = ({ onSelectDocument, selectedDocument }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/documents');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDocuments(data.list_of_names.map((name, index) => ({ id: index + 1, name: name })));
      } catch (err) {
        setError(err);
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) {
    return <div className="documents-section">Loading documents...</div>;
  }

  if (error) {
    return <div className="documents-section">Error: {error.message}</div>;
  }

  return (
    <div className="documents-section">
      <h2>Documents</h2>
      <div className="documents-list">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`document-item ${selectedDocument?.id === doc.id ? 'selected' : ''}`}
            onClick={() => {
              onSelectDocument(doc);
              // Chat history renewal will be handled by the parent component via onSelectDocument
            }}
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