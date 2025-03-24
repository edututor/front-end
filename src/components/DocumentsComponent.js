import React, { useState, useEffect, useRef } from 'react';
import '../styles/Documents.css';

const REACT_APP_FETCH_DOCUMENTS_URL = process.env.REACT_APP_FETCH_DOCUMENTS_URL;

const DocumentsComponent = ({ onSelectDocument, selectedDocument, newDocumentUploaded, onDocumentUpload }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredDocId, setHoveredDocId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      await onDocumentUpload(file, (progress) => {
        setUploadProgress(progress);
      });
    } catch (error) {
      console.error("Failed to upload document:", error);
      setError(new Error("Failed to upload document. Please try again."));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleFileUpload(file);
    }
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

  // Render loading state
  if (loading && !isUploading) {
    return <div className="documents-section loading-message">Loading documents...</div>;
  }

  // Render error state
  if (error && !isUploading) {
    return <div className="documents-section error-message">Error: {error.message}</div>;
  }

  return (
    <div 
      className={`documents-section ${isDragging ? 'dragging' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="documents-header">
        <h2>Documents</h2>
        <div className="upload-button-container">
          <button 
            className="floating-upload-btn"
            onClick={() => fileInputRef.current.click()}
            title="Upload Document"
          >
            +
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx,.txt"
          />
        </div>
      </div>
      
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

      {documents.length === 0 && !loading && !isUploading ? (
        <div className="no-documents">
          <p>No documents available. Upload a document to get started:</p>
          <ul>
            <li>Drag and drop a document here</li>
            <li>Or click the + button to upload</li>
          </ul>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default DocumentsComponent;