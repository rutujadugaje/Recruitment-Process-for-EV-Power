import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    const email = prompt("Please enter your email to start the test:");
    if (email) {
      navigate('/onlinetest', { state: { email } });
    }
  };

  const handleViewHistory = () => {
    navigate('/test-history');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">EV Knowledge Test</h1>
        <div className="space-y-4">
          <button
            onClick={handleStartTest}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Start New Test
          </button>
          <button
            onClick={handleViewHistory}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            View Test History
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;