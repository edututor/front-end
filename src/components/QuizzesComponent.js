import React, { useState, useEffect } from 'react';
import '../styles/Quizzes.css';


const API_URL = 'http://127.0.0.1:8001';

const QuizzesComponent = ({ selectedDocument }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all quizzes when component mounts or document changes
  useEffect(() => {
    if (selectedDocument) {
      fetchQuizzes();
    } else {
      setQuizzes([]);
    }
    // Reset state when selected document changes
    setSelectedQuiz(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
  }, [selectedDocument]);

  // Fetch all quizzes from the API
  const fetchQuizzes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/get-all-quizzes`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();

      // Filter quizzes that match the selected document
      const documentQuizzes = data.filter(quiz => 
        quiz.document_name === selectedDocument.name
      );

      setQuizzes(documentQuizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setError("Failed to load quizzes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = async (quizId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/get-selected-quiz/${quizId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const quizData = await response.json();
      setSelectedQuiz(quizData);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setError("Failed to load quiz. Please try again later.");
    } finally {
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

  if (!selectedDocument) {
    return null;
  }

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

  // Show error message if there's an error
  if (error) {
    return (
      <div className="quizzes-section">
        <h2>Available Quizzes</h2>
        <div className="error-message">
          <p>{error}</p>
          <button className="quiz-btn" onClick={fetchQuizzes}>
            Try Again
          </button>
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