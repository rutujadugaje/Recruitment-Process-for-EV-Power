import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OnlineTest = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { email } = state || {};
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userTests, setUserTests] = useState([]);
  const [videoError, setVideoError] = useState(null);
  const timerRef = useRef(null);
  const selectedAnswersRef = useRef({});
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize userTests from localStorage
  useEffect(() => {
    const savedTests = JSON.parse(localStorage.getItem('userTests') || '[]');
    setUserTests(savedTests);
  }, []);

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/aptitude');
        if (!response.data || response.data.length === 0) {
          throw new Error('No questions available in the database');
        }
        setQuestions(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err.response?.data?.message || err.message);
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Initialize webcam
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
        setVideoError('Unable to access webcam. Please ensure camera permissions are granted.');
      }
    };
    startVideo();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Update ref when selectedAnswers changes
  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    clearInterval(timerRef.current);

    let correctAnswers = 0;
    questions.forEach((question) => {
      if (selectedAnswersRef.current[question._id] === question.answer) {
        correctAnswers++;
      }
    });

    const testResult = {
      questions,
      selectedAnswers: { ...selectedAnswersRef.current },
      score: correctAnswers,
      totalQuestions: questions.length,
      timeSpent: 60 * 60 - timeLeft,
      percentage: questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0,
      testDate: new Date().toISOString(),
      email: email || null,
    };

    setUserTests((prevTests) => {
      const updatedTests = [...prevTests, testResult];
      localStorage.setItem('userTests', JSON.stringify(updatedTests));
      return updatedTests;
    });

    // Stop webcam stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    navigate('/hr-dashboard', {
      state: {
        email,
        allTests: [...userTests, testResult],
        latestTest: testResult,
        activeTab: 'results',
      },
    });
  }, [navigate, questions, timeLeft, email, isSubmitting, userTests]);

  // Handle timer countdown
  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isLoading, questions, handleSubmit]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {questions.length === 0 ? 'No Questions Available' : 'Error Loading Questions'}
            </h2>
            <p className="text-gray-600 mb-6">
              {questions.length === 0
                ? 'The question bank is currently empty. Please contact the administrator.'
                : error}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full px-4 rounded bg-gray-200 text-gray-800 py-2 hover:bg-gray-300"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const allQuestionsAnswered = Object.keys(selectedAnswers).length === questions.length;
  const timerEnded = timeLeft <= 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 bg-white rounded-xl shadow-md p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Webcam Feed</h3>
              {videoError ? (
                <div className="text-red-500 text-sm">{videoError}</div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 rounded-lg object-cover"
                />
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">EV Knowledge Test</h1>
                <p className="text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
              <div
                className={`text-xl font-bold px-4 py-2 rounded-lg ${
                  timeLeft <= 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}
              >
                Time Left: {formatTime(timeLeft)}
              </div>
            </div>
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">{currentQuestion.question}</h2>
              <div className="space-y-4">
                {currentQuestion.options.map((option, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleOptionSelect(currentQuestion._id, option)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedAnswers[currentQuestion._id] === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                          selectedAnswers[currentQuestion._id] === option
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedAnswers[currentQuestion._id] === option && (
                          <span className="text-white text-sm">✓</span>
                        )}
                      </div>
                      <span className="text-gray-800">{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-8">
              <button
                onClick={goToPrevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-3 rounded-lg w-full sm:w-auto ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ← Previous
              </button>
              <div className="flex gap-3 w-full sm:w-auto">
                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={goToNextQuestion}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!(allQuestionsAnswered || timerEnded) || isSubmitting}
                    className={`px-6 py-3 rounded-lg w-full ${
                      allQuestionsAnswered || timerEnded
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 bg-white rounded-xl shadow-md p-6 h-fit sticky top-4">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-3">
                {questions.map((q, index) => (
                  <button
                    key={q._id}
                    onClick={() => goToQuestion(index)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      selectedAnswers[q._id]
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                    } ${
                      currentQuestionIndex === index
                        ? 'ring-2 ring-blue-500 transform scale-105'
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm text-gray-600">
                  {Object.keys(selectedAnswers).length}/{questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-100 border border-green-300 mr-2"></div>
                <span className="text-sm text-gray-600">Answered</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-300 mr-2"></div>
                <span className="text-sm text-gray-600">Unanswered</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-100 border border-blue-300 mr-2"></div>
                <span className="text-sm text-gray-600">Current</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!(allQuestionsAnswered || timerEnded) || isSubmitting}
              className={`w-full py-3 rounded-lg font-medium ${
                allQuestionsAnswered || timerEnded
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {timerEnded ? "Time's Up! Submit Now" : 'Submit Test Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineTest;

