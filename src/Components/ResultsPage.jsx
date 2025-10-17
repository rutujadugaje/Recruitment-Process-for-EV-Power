import { useLocation, useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    questions = [],
    selectedAnswers = {},
    score = 0,
    totalQuestions = 0,
    percentage = 0,
    timeSpent = 0,
    userEmail = '',
    isFromHistory = false
  } = location.state || {};

  if (!location.state) {
    navigate('/');
    return null;
  }

  const handleBack = () => {
    if (isFromHistory) {
      navigate('/test-history');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Test Results</h1>
            <p className="text-gray-600">User: {userEmail}</p>
            <p className="text-gray-600">
              Test Date: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            {isFromHistory ? 'Back to History' : 'Back to Home'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800">Score</h3>
            <p className="text-2xl font-bold">{score}/{totalQuestions}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800">Percentage</h3>
            <p className="text-2xl font-bold">{percentage}%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800">Time Spent</h3>
            <p className="text-2xl font-bold">
              {Math.floor(timeSpent / 60)}m {timeSpent % 7}s
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Question Review</h2>
        <div className="space-y-6">
          {questions.map((question, index) => {
            const isCorrect = selectedAnswers[question._id] === question.answer;
            
            return (
              <div 
                key={index} 
                className={`p-4 border rounded-lg ${
                  isCorrect 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <p className="font-medium mb-2">
                  {index + 1}. {question.text}
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Your answer:</span> 
                    <span className={`ml-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {selectedAnswers[question._id] || 'Not answered'}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-sm">
                      <span className="font-medium">Correct answer:</span> 
                      <span className="ml-2 text-green-700">{question.answer}</span>
                    </p>
                  )}
                  <p className={`text-sm font-medium ${
                    isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;