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
        const response = await fetch('/api/documents'); // API call to fetch documents
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDocuments(data); 
      } catch (err) {
        setError(err);
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);


  return (
    <div className="documents-section">
      <h2>Documents</h2>
      <div className="documents-list">
      </div>
    </div>
  );
};

export default DocumentsComponent;