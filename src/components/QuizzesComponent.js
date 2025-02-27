import React, { useState, useEffect } from 'react';
import '../styles/Quizzes.css';

const QuizzesComponent = ({ selectedDocument }) => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  // Reset state when selected document changes
  useEffect(() => {
    setSelectedQuiz(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
  }, [selectedDocument]);

  if (!selectedDocument) {
    return null;
  }

  const quizzes = documentQuizzes[selectedDocument.id] || [];

  const handleStartQuiz = async (quizId) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to fetch quiz data
      // For now, we'll simulate with a timeout and mock data based on the specified format
      setTimeout(() => {
        const mockQuizData = {
          id: quizId,
          title: quizzes.find(q => q.id === quizId).title,
          document_name: selectedDocument.name,
          created_at: "2025-02-19T02:19:41",
          questions: [
            {
              id: 1,
              question_text: "What literary device is predominantly used when comparing a component to a building block?",
              hint: "Consider a comparison without using 'like' or 'as'.",
              answers: [
                {
                  id: 1,
                  answer_text: "Metaphor",
                  is_correct_answer: true
                },
                {
                  id: 2,
                  answer_text: "Simile",
                  is_correct_answer: false
                },
                {
                  id: 3,
                  answer_text: "Alliteration",
                  is_correct_answer: false
                },
                {
                  id: 4,
                  answer_text: "Personification",
                  is_correct_answer: false
                }
              ]
            },
            {
              id: 2,
              question_text: "True or False: React components must be classes.",
              hint: "Think about functional components.",
              answers: [
                {
                  id: 5,
                  answer_text: "True",
                  is_correct_answer: false
                },
                {
                  id: 6,
                  answer_text: "False",
                  is_correct_answer: true
                }
              ]
            },
            {
              id: 3,
              question_text: "In her monologue, what does Juliet suggest about the importance of a name?",
              hint: "Juliet questions the significance of the name Montague.",
              answers: [
                {
                  id: 8,
                  answer_text: "A name does not define the essence of a person.",
                  is_correct_answer: true
                },
                {
                  id: 10,
                  answer_text: "A name is a symbol of one's family heritage.",
                  is_correct_answer: false
                },
                {
                  id: 7,
                  answer_text: "A name is essential for one's identity.",
                  is_correct_answer: false
                },
                {
                  id: 9,
                  answer_text: "A name should be changed to suit romantic desires.",
                  is_correct_answer: false
                }
              ]
            },
            {
              id: 4,
              question_text: "What does Romeo mean when he says, 'With love’s light wings did I o’erperch these walls'?",
              hint: "Think about how love motivates and empowers Romeo.",
              answers: [
                {
                  id: 13,
                  answer_text: "He built a ladder to climb over the wall.",
                  is_correct_answer: false
                },
                {
                  id: 14,
                  answer_text: "He had help from Mercutio to climb the wall.",
                  is_correct_answer: false
                },
                {
                  id: 11,
                  answer_text: "He used actual wings to fly over the wall.",
                  is_correct_answer: false
                },
                {
                  id: 12,
                  answer_text: "His love for Juliet gave him the courage and motivation to overcome obstacles.",
                  is_correct_answer: true
                }
              ]
            }  
          ]
        };
        
        setSelectedQuiz(mockQuizData);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setIsLoading(false);
    }
  };

  const handleCloseQuiz = () => {
    setSelectedQuiz(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSelectAnswer = (questionId, answerId) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answerId
    });
  };

  // Render the quiz content when a quiz is selected
  if (selectedQuiz) {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    return (
      <div className="quizzes-section">
        <div className="quiz-active">
          <div className="quiz-header">
            <h2>{selectedQuiz.title}</h2>
            <button className="quiz-btn" onClick={handleCloseQuiz}>
              Close Quiz
            </button>
          </div>
          
          <div className="quiz-progress">
            <span>Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="quiz-question">
            <p className="question-text">{currentQuestion.question_text}</p>
            
            <div className="options-list">
              {currentQuestion.answers.map((answer) => (
                <button 
                  key={answer.id} 
                  className={`option-btn ${userAnswers[currentQuestion.id] === answer.id ? 'selected' : ''}`}
                  onClick={() => handleSelectAnswer(currentQuestion.id, answer.id)}
                >
                  {answer.answer_text}
                </button>
              ))}
            </div>
            
            {currentQuestion.hint && (
              <div className="hint-box">
                <p><strong>Hint:</strong> {currentQuestion.hint}</p>
              </div>
            )}
          </div>
          
          <div className="quiz-controls">
            <button 
              className="quiz-btn"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button 
              className="quiz-btn"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === selectedQuiz.questions.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the list of quizzes when no quiz is selected
  return (
    <div className="quizzes-section">
      <h2>Available Quizzes</h2>
      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading quiz...</p>
        </div>
      ) : quizzes.length > 0 ? (
        <div className="quizzes-list">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-item">
              <span>{quiz.title}</span>
              <button 
                className="start-quiz-btn"
                onClick={() => handleStartQuiz(quiz.id)}
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-quizzes">
          <p>No quizzes available for this document.</p>
        </div>
      )}
    </div>
  );
};

export default QuizzesComponent;
