import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UserTestsTable = () => {
  const [userTests, setUserTests] = useState([]);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
   const {email} = location.state || {}

  useEffect(() => {
    // Check if we're coming from a test submission
    if (location.state?.allTests) {
      setUserTests(location.state.allTests);
      setTotalCandidates(location.state.allTests.length);
    } else {
      // Load from localStorage
      const savedTests = JSON.parse(localStorage.getItem('userTests') || '[]');
      setUserTests(savedTests);
      setTotalCandidates(savedTests.length);
    }
  }, [location.state]);

  const handleViewResults = (testData) => {
    navigate('/results', { 
      state: {
        
        questions: testData.questions,
        selectedAnswers: testData.selectedAnswers,
        score: testData.score,
        totalQuestions: testData.totalQuestions,
        timeSpent: testData.timeSpent,
        percentage: testData.percentage,
        isFromHistory: true
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <div className="max-w-6xl mx-auto p-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Result of Candidates</h1>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
            Total Candidates: {totalCandidates}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userTests.map((test, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(test.testDate).toLocaleDateString()}<br/>
                    {new Date(test.testDate).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {test.score} / {test.totalQuestions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      test.percentage >= 70 ? 'bg-green-100 text-green-800' : 
                      test.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {test.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.floor(test.timeSpent / 60)}m {test.timeSpent % 60}s
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleViewResults(test)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {userTests.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No test attempts found</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Take a Test
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTestsTable;