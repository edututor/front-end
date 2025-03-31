import React, { useState } from 'react';
import './App.css';
import 'EditQuizzes.css';

const QuizEditor = () => {
  const [quizData, setQuizData] = useState({
    id: 1,
    title: "Romeo and Juliet Act 2, Scene 2: The Balcony Scene Quiz",
    document_name: "romeo-and-juliet_PDF_FolgerShakespeare.pdf",
    created_at: "2025-02-19T02:19:41",
    questions: [
      {
        id: 1,
        question_text: "What literary device is predominantly used when Romeo refers to Juliet as the sun?",
        hint: "Consider a comparison without using 'like' or 'as'.",
        answers: [
          { id: 3, answer_text: "Alliteration", is_correct_answer: false },
          { id: 1, answer_text: "Metaphor", is_correct_answer: true },
          { id: 4, answer_text: "Personification", is_correct_answer: false },
          { id: 2, answer_text: "Simile", is_correct_answer: false }
        ]
      },
      {
        id: 2,
        question_text: "True or False: Juliet is aware of Romeo's presence before she starts speaking in the balcony scene.",
        hint: "Think about whether Juliet initially knows Romeo is listening to her.",
        answers: [
          { id: 6, answer_text: "False", is_correct_answer: true },
          { id: 5, answer_text: "True", is_correct_answer: false }
        ]
      },
      {
        id: 3,
        question_text: "In her monologue, what does Juliet suggest about the importance of a name?",
        hint: "Juliet questions the significance of the name Montague.",
        answers: [
          { id: 8, answer_text: "A name does not define the essence of a person.", is_correct_answer: true },
          { id: 10, answer_text: "A name is a symbol of one's family heritage.", is_correct_answer: false },
          { id: 7, answer_text: "A name is essential for one's identity.", is_correct_answer: false },
          { id: 9, answer_text: "A name should be changed to suit romantic desires.", is_correct_answer: false }
        ]
      },
      {
        id: 4,
        question_text: "What does Romeo mean when he says, 'With love's light wings did I o'erperch these walls'?",
        hint: "Think about how love motivates and empowers Romeo.",
        answers: [
          { id: 13, answer_text: "He built a ladder to climb over the wall.", is_correct_answer: false },
          { id: 14, answer_text: "He had help from Mercutio to climb the wall.", is_correct_answer: false },
          { id: 11, answer_text: "He used actual wings to fly over the wall.", is_correct_answer: false },
          { id: 12, answer_text: "His love for Juliet gave him the courage and motivation to overcome obstacles.", is_correct_answer: true }
        ]
      }
    ]
  });

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  const handleQuestionTextChange = (event) => {
    const updatedQuizData = { ...quizData};
    updatedQuizData.questions[selectedQuestionIndex].question_text = event.target.value;
    setQuizData(updatedQuizData);
  }

  const handleAnswerTextChange = (event, answerIndex) => {
    const updatedQuizData = { ...quizData };
    updatedQuizData.questions[selectedQuestionIndex].answers[answerIndex].answer_text = event.target.value;
    setQuizData(updatedQuizData);
  }

  const handleHintTextChange = (event) => {
    const updatedQuizData = { ...quizData };
    updatedQuizData.questions[selectedQuestionIndex].hint = event.target.value;
    setQuizData(updatedQuizData);
  }

  const handleCorrectAnswerChange = (event, answerIndex) => {
    const updatedQuiz = { ...quizData };
    //Set all answers to false
    updatedQuiz.questions[selectedQuestionIndex].answers.forEach((answer) => {
      answer.is_correct_answer = false;
    });
    //Only update the new answer
    updatedQuiz.questions[selectedQuestionIndex].answers[answerIndex].is_correct_answer = event.target.checked;
    setQuizData(updatedQuiz);
  }

  const handleNextQuestion = () => {
    if (selectedQuestionIndex + 1 < quizData.questions.length) {
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
    }
  }

  const handlePreviousQuestion = () => {
    if (selectedQuestionIndex > 0) {
      setSelectedQuestionIndex(selectedQuestionIndex - 1);
    }
  }

  const saveQuiz = () => { //Call api 
    console.log(quizData);
  }

  const currentQuestion = quizData.questions[selectedQuestionIndex];

  return(
    <div className="quiz-editor">
      <h1> Editing "{quizData.title}"</h1>
      <div className="question-editor">
        <h2>Question {selectedQuestionIndex + 1}</h2>
        <div className="question-navigation">
        <button className = "quiz-btn" onClick={handlePreviousQuestion}>
          Previous</button>
        <button className = "quiz-btn" onClick={handleNextQuestion}>
          Next</button>
        </div>
        <label>Question Text:</label>
        <input type="text" value={currentQuestion.question_text} onChange={handleQuestionTextChange} />
        <label>Hint:</label>
        <input type="text" value={currentQuestion.hint} onChange={handleHintTextChange} />
        <h3>Answers:</h3>
        {currentQuestion.answers.map((answer, index) => (
          <div key={answer.id}>
            <input name="correct-answer" type="radio" checked={answer.is_correct_answer} onChange={(event) => handleCorrectAnswerChange(event, index)} />
            <input className="answers" type="text" value={answer.answer_text} onChange={(event) => handleAnswerTextChange(event, index)} />
          </div>
        ))}
      </div>
      <button className="quiz-btn" onClick={saveQuiz}>Save Quiz</button>
    </div> 

  )


}

export default QuizEditor;