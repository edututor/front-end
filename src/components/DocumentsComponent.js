import React, { useState, useEffect } from 'react';
import '../styles/Documents.css';

const REACT_APP_FETCH_DOCUMENTS_URL = process.env.REACT_APP_FETCH_DOCUMENTS_URL;

const DocumentsComponent = ({ onSelectDocument, selectedDocument, newDocumentUploaded }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredDocId, setHoveredDocId] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${REACT_APP_FETCH_DOCUMENTS_URL}/api/documents`);
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
  }, [newDocumentUploaded]);

  useEffect(() => {
    if (newDocumentUploaded && documents.length > 0) {
      const uploadedDoc = documents.find(doc => doc.name === newDocumentUploaded);
      if (uploadedDoc) {
        onSelectDocument(uploadedDoc);
      }
    }
  }, [newDocumentUploaded, documents, onSelectDocument]);

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
            }}
            onMouseEnter={() => setHoveredDocId(doc.id)}
            onMouseLeave={() => setHoveredDocId(null)}
          >
            <span>{doc.name}</span>
            {hoveredDocId === doc.id && (
              <div className="tooltip">{doc.name}</div>
            )}
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