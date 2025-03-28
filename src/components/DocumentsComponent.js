import React, { useState, useEffect, useRef } from 'react';
import '../styles/Documents.css';

const REACT_APP_FETCH_DOCUMENTS_URL = process.env.REACT_APP_FETCH_DOCUMENTS_URL;
const REACT_APP_PDF_UPLOAD_URL = process.env.REACT_APP_PDF_UPLOAD_URL;

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
    setError(null);
    
    try {
      // Validate file type
      if (!file.type || file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
      }

      const formData = new FormData();
      formData.append('file', file);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const response = await fetch(`${REACT_APP_PDF_UPLOAD_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });

      clearInterval(progressInterval);

      // Handle different response statuses
      if (response.status === 409) {
        const data = await response.json();
        setUploadProgress(100);
        const newDocument = {
          id: Date.now(),
          name: file.name,
          url: data.file_url
        };
        setDocuments(prevDocs => [...prevDocs, newDocument]);
        onSelectDocument(newDocument);
        return;
      } else if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      } else if (response.status === 500) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      } else if (response.status === 200) {
        const uploadResponse = await response.json();
        setUploadProgress(100);
        
        const newDocument = {
          id: Date.now(),
          name: file.name,
          url: uploadResponse.file_url
        };
        
        // Update documents list and trigger refresh
        setDocuments(prevDocs => [...prevDocs, newDocument]);
        onSelectDocument(newDocument);
        
        // Trigger document list refresh
        const response = await fetch(`${REACT_APP_FETCH_DOCUMENTS_URL}/api/documents`);
        if (response.ok) {
          const data = await response.json();
          setDocuments(data.list_of_names.map((name, index) => ({ id: index + 1, name: name })));
        }
      } else {
        throw new Error('Upload failed with unexpected status');
      }
      
    } catch (error) {
      console.error("Failed to upload document:", error);
      setError(error);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
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

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Render loading state
  if (loading) {
    return <div className="documents-loading">Loading documents...</div>;
  }

  // Render error state
  if (error) {
    return <div className="documents-error">Error: {error.message}</div>;
  }

  return (
    <div 
      className="documents-container"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="documents-header">
        <h2>Documents</h2>
        <button 
          className="upload-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(file);
          }
        }}
        accept=".pdf"
        style={{ display: 'none' }}
      />

      {isUploading && (
        <div className="upload-progress">
          <div 
            className="progress-bar"
            style={{ width: `${uploadProgress}%` }}
          />
          <span>{uploadProgress}%</span>
        </div>
      )}

      <div className={`documents-list ${isDragging ? 'dragging' : ''}`}>
        {documents.length === 0 ? (
          <div className="no-documents">No documents uploaded yet</div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="document-item"
              onMouseEnter={() => setHoveredDocId(doc.id)}
              onMouseLeave={() => setHoveredDocId(null)}
            >
              <span className="document-name">{doc.name}</span>
              <button
                className={`select-button ${selectedDocument?.id === doc.id ? 'selected' : ''}`}
                onClick={() => onSelectDocument(doc)}
              >
                {selectedDocument?.id === doc.id ? 'Selected' : 'Select'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentsComponent;