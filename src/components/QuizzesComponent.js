import React from 'react';
import '../styles/Quizzes.css';

const QuizzesComponent = ({ selectedDocument }) => {
  // Pre-loaded quizzes for each document
  const documentQuizzes = {
    1: [
      { id: 1, title: "React Components" },
      { id: 2, title: "React Hooks" },
      { id: 3, title: "React Router" },
      { id: 4, title: "State Management" }
    ],
    2: [
      { id: 5, title: "Variables & Data Types" },
      { id: 6, title: "Functions & Scope" },
      { id: 7, title: "Arrays & Objects" },
      { id: 8, title: "ES6 Features" }
    ],
    3: [
      { id: 9, title: "Python Basics" },
      { id: 10, title: "Functions" },
      { id: 11, title: "OOP in Python" },
      { id: 12, title: "File Handling" }
    ],
    4: [
      { id: 13, title: "Arrays & Lists" },
      { id: 14, title: "Stacks & Queues" },
      { id: 15, title: "Trees & Graphs" },
      { id: 16, title: "Sorting Algorithms" }
    ]
  };

  if (!selectedDocument) {
    return null;
  }

  const quizzes = documentQuizzes[selectedDocument.id] || [];

  return (
    <div className="quizzes-section">
      <h2>Available Quizzes</h2>
      <div className="quizzes-list">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-item">
            <span>{quiz.title}</span>
            <button className="start-quiz-btn">
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizzesComponent;
