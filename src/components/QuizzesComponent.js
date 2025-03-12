import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Quizzes.css';

const REACT_APP_FETCH_QUIZZES_URL = process.env.REACT_APP_FETCH_QUIZZES_URL;
const REACT_APP_EDIT_QUIZ_URL = process.env.REACT_APP_EDIT_QUIZ_URL || process.env.REACT_APP_FETCH_QUIZZES_URL; // Fallback to same base URL

const QuizzesComponent = ({ selectedDocument }) => {
  const [quizzes, setQuizzes] = useState([]);

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // New states for quiz editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuiz, setEditedQuiz] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Fetch all quizzes from the API
  const fetchQuizzes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${REACT_APP_FETCH_QUIZZES_URL}/api/get-all-quizzes`);
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
  }, [selectedDocument]);

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
    setIsEditing(false);
    setEditedQuiz(null);
  }, [selectedDocument, fetchQuizzes]);


  const handleStartQuiz = async (quizId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${REACT_APP_FETCH_QUIZZES_URL}/api/get-selected-quiz/${quizId}`);
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
    setIsEditing(false);
    setEditedQuiz(null);
    setSuccessMessage(null);
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

  const handleSelectAnswer = (questionId, answerId) => {                      //edited
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const selectedAnswer = currentQuestion.answers.find(answer => answer.id === answerId);
    
    setUserAnswers({
      ...userAnswers,
      [questionId]: {
        answerId: answerId,
        isCorrect: selectedAnswer.is_correct_answer
      }
    });
  };

  // New functions for quiz editing
  const handleEditQuiz = async (quizId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${REACT_APP_FETCH_QUIZZES_URL}/api/get-selected-quiz/${quizId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const quizData = await response.json();
      setEditedQuiz(quizData);
      setIsEditing(true);
    } catch (error) {
      console.error("Error fetching quiz for edit:", error);
      setError("Failed to load quiz for editing. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuizTitle = (e) => {
    setEditedQuiz({
      ...editedQuiz,
      title: e.target.value
    });
  };

  const handleUpdateQuestionText = (index, value) => {
    const updatedQuestions = [...editedQuiz.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      question_text: value
    };
    
    setEditedQuiz({
      ...editedQuiz,
      questions: updatedQuestions
    });
  };

  const handleUpdateQuestionHint = (index, value) => {
    const updatedQuestions = [...editedQuiz.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      hint: value
    };
    
    setEditedQuiz({
      ...editedQuiz,
      questions: updatedQuestions
    });
  };

  const handleUpdateAnswerText = (questionIndex, answerIndex, value) => {
    const updatedQuestions = [...editedQuiz.questions];
    const updatedAnswers = [...updatedQuestions[questionIndex].answers];
    
    updatedAnswers[answerIndex] = {
      ...updatedAnswers[answerIndex],
      answer_text: value
    };
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      answers: updatedAnswers
    };
    
    setEditedQuiz({
      ...editedQuiz,
      questions: updatedQuestions
    });
  };

  const handleToggleCorrectAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = [...editedQuiz.questions];
    const updatedAnswers = [...updatedQuestions[questionIndex].answers];
    
    // Set all answers to incorrect first
    updatedAnswers.forEach((answer, idx) => {
      updatedAnswers[idx] = {
        ...answer,
        is_correct_answer: false
      };
    });
    
    // Set selected answer to correct
    updatedAnswers[answerIndex] = {
      ...updatedAnswers[answerIndex],
      is_correct_answer: true
    };
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      answers: updatedAnswers
    };
    
    setEditedQuiz({
      ...editedQuiz,
      questions: updatedQuestions
    });
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      question_text: "New question",
      hint: "Hint for new question",
      answers: [
        { answer_text: "Answer 1", is_correct_answer: true },
        { answer_text: "Answer 2", is_correct_answer: false },
        { answer_text: "Answer 3", is_correct_answer: false },
      ]
    };
    
    setEditedQuiz({
      ...editedQuiz,
      questions: [...editedQuiz.questions, newQuestion]
    });
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...editedQuiz.questions];
    updatedQuestions.splice(index, 1);
    
    setEditedQuiz({
      ...editedQuiz,
      questions: updatedQuestions
    });
  };

  const handleAddAnswer = (questionIndex) => {
    const updatedQuestions = [...editedQuiz.questions];
    const updatedAnswers = [...updatedQuestions[questionIndex].answers];
    
    updatedAnswers.push({
      answer_text: "New answer",
      is_correct_answer: false
    });
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      answers: updatedAnswers
    };
    
    setEditedQuiz({
      ...editedQuiz,
      questions: updatedQuestions
    });
  };

  const handleRemoveAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = [...editedQuiz.questions];
    const updatedAnswers = [...updatedQuestions[questionIndex].answers];
    
    // Don't allow removing the last answer
    if (updatedAnswers.length <= 1) {
      return;
    }
    
    updatedAnswers.splice(answerIndex, 1);
    
    // Ensure at least one answer is marked as correct
    if (!updatedAnswers.some(answer => answer.is_correct_answer)) {
      updatedAnswers[0].is_correct_answer = true;
    }
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      answers: updatedAnswers
    };
    
    setEditedQuiz({
      ...editedQuiz,
      questions: updatedQuestions
    });
  };

  const handleSaveQuizEdits = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Prepare data according to the EditQuizRequest schema
      const requestData = {
        id: editedQuiz.id,
        title: editedQuiz.title,
        document_name: editedQuiz.document_name,
        questions: editedQuiz.questions.map(q => ({
          question_text: q.question_text,
          hint: q.hint,
          answers: q.answers.map(a => ({
            answer_text: a.answer_text,
            is_correct_answer: a.is_correct_answer
          }))
        }))
      };
      
      const response = await fetch(`${REACT_APP_EDIT_QUIZ_URL}/api/edit-quiz`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Quiz updated successfully, ID:", data.quiz_id);
      setSuccessMessage("Quiz updated successfully!");
      fetchQuizzes(); // Refresh the quizzes list
      
      // Optionally close the edit mode after successful save
      // setIsEditing(false);
      // setEditedQuiz(null);
    } catch (error) {
      console.error("Error updating quiz:", error);
      setError(`Failed to update quiz: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedDocument) {
    return null;
  }

   // Render the edit quiz form when editing is active
   if (isEditing && editedQuiz) {
    return (
      <div className="quizzes-section">
        <div className="quiz-editor">
          <div className="quiz-header">
            <h2>Edit Quiz</h2>
            <div className="editor-actions">
              <button className="quiz-btn cancel-btn" onClick={() => {
                setIsEditing(false);
                setEditedQuiz(null);
                setSuccessMessage(null);
              }}>
                Cancel
              </button>
              <button 
                className="quiz-btn save-btn" 
                onClick={handleSaveQuizEdits}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Quiz'}
              </button>
            </div>
          </div>
          
          {successMessage && (
            <div className="success-message">
              <p>{successMessage}</p>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          <div className="editor-form">
            <div className="form-group">
              <label>Quiz Title:</label>
              <input 
                type="text" 
                value={editedQuiz.title} 
                onChange={handleUpdateQuizTitle}
                className="quiz-input"
              />
            </div>
            
            <div className="questions-editor">
              <h3>Questions</h3>
              <button 
                className="add-btn"
                onClick={handleAddQuestion}
              >
                Add Question
              </button>
              
              {editedQuiz.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-editor">
                  <div className="question-header">
                    <h4>Question {qIndex + 1}</h4>
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      disabled={editedQuiz.questions.length <= 1}
                    >
                      Remove Question
                    </button>
                  </div>
                  
                  <div className="form-group">
                    <label>Question Text:</label>
                    <textarea 
                      value={question.question_text}
                      onChange={(e) => handleUpdateQuestionText(qIndex, e.target.value)}
                      className="quiz-textarea"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Hint:</label>
                    <textarea 
                      value={question.hint}
                      onChange={(e) => handleUpdateQuestionHint(qIndex, e.target.value)}
                      className="quiz-textarea"
                    />
                  </div>
                  
                  <div className="answers-editor">
                    <h5>Answers</h5>
                    <button 
                      className="add-btn"
                      onClick={() => handleAddAnswer(qIndex)}
                    >
                      Add Answer
                    </button>
                    
                    {question.answers.map((answer, aIndex) => (
                      <div key={aIndex} className="answer-editor">
                        <div className="answer-controls">
                          <div className="form-group">
                            <input 
                              type="text"
                              value={answer.answer_text}
                              onChange={(e) => handleUpdateAnswerText(qIndex, aIndex, e.target.value)}
                              className="quiz-input"
                            />
                          </div>
                          
                          <div className="form-group answer-options">
                            <label className="checkbox-label">
                              <input 
                                type="radio"
                                checked={answer.is_correct_answer}
                                onChange={() => handleToggleCorrectAnswer(qIndex, aIndex)}
                                name={`correct-answer-${qIndex}`}
                              />
                              Correct Answer
                            </label>
                            
                            <button 
                              className="remove-btn"
                              onClick={() => handleRemoveAnswer(qIndex, aIndex)}
                              disabled={question.answers.length <= 1}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
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
                  className={`option-btn ${
                    userAnswers[currentQuestion.id]?.answerId === answer.id 
                      ? userAnswers[currentQuestion.id].isCorrect 
                        ? 'correct'
                        : 'incorrect'
                      : ''
                  } ${userAnswers[currentQuestion.id]?.answerId === answer.id ? 'selected' : ''}`}
                  onClick={() => handleSelectAnswer(currentQuestion.id, answer.id)}
                  disabled={userAnswers[currentQuestion.id]}
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
              <div className="quiz-actions">
                <button 
                  className="start-quiz-btn"
                  onClick={() => handleStartQuiz(quiz.id)}
                >
                  Start Quiz
                </button>
                <button 
                  className="edit-quiz-btn"
                  onClick={() => handleEditQuiz(quiz.id)}
                >
                  Edit Quiz
                </button>
              </div>
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