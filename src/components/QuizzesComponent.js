import React, { useState, useEffect } from 'react';
import '../styles/Home.css';

const QuizzesComponent = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/quizzes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQuizzes(data.data);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to load quizzes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="quizzes-container">
      <h2>Quizzes</h2>
      <ul>
        <li>Quiz 1</li>
        <li>Quiz 2</li>
        <li>Quiz 3</li>
        <li>Quiz 4</li>
      </ul>
      {isLoading ? (
        <p>Loading quizzes...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <li key={quiz.id}>
                {quiz.title} ({quiz.document_name})
              </li>
            ))
          ) : (
            <p>No quizzes found</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default QuizzesComponent;
