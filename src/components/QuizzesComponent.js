import React, { useState, useEffect } from 'react';
import '../styles/Quizzes.css';

const QuizzesComponent = ({ selectedDocument }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!selectedDocument) return;
      
      setLoading(true);
      try {
        const response = await fetch('/api/get-all-quizzes');
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }
        const data = await response.json();
        // Filter quizzes for the selected document
        const documentQuizzes = data.filter(
          quiz => quiz.document_name === selectedDocument.name
        );
        setQuizzes(documentQuizzes);
        setError(null);
      } catch (err) {
        setError('Failed to load quizzes');
        console.error('Error fetching quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [selectedDocument]);

  if (!selectedDocument) {
    return null;
  }

  if (loading) {
    return (
      <div className="quizzes-section">
        <h2>Available Quizzes</h2>
        <div className="loading">Loading quizzes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quizzes-section">
        <h2>Available Quizzes</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="quizzes-section">
      <h2>Available Quizzes</h2>
      <div className="quizzes-list">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-item">
              <span>{quiz.title}</span>
              <button className="start-quiz-btn">
                Start Quiz
              </button>
            </div>
          ))
        ) : (
          <div className="no-quizzes">
            No quizzes available for this document.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesComponent;
