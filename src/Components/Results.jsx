
const Results = ({ questions = [], selectedAnswers = {}, timeSpent = "00:00", email, testDate }) => {
  const score = questions.reduce((acc, question) => {
    const userAnswer = selectedAnswers[question.id];
    return acc + (userAnswer === question.answer ? 1 : 0);
  }, 0);
  const percentage = questions.length > 0 ? ((score / questions.length) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-800 mb-4">Test Results</h1>
          <div className="w-24 h-1 bg-indigo-500 mx-auto"></div>
          {email && <p className="text-lg text-gray-600 mt-2">Candidate: {email}</p>}
          {testDate && <p className="text-lg text-gray-600">Test Date: {new Date(testDate).toLocaleString()}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Score</h3>
            <p className="text-3xl font-bold text-indigo-600">{score}<span className="text-gray-500">/{questions.length}</span></p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Percentage</h3>
            <p className="text-3xl font-bold text-indigo-600">{percentage}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Time Spent</h3>
            <p className="text-3xl font-bold text-indigo-600">{timeSpent}</p>
          </div>
        </div>
        <div className="bg-white rounded-md shadow-lg overflow-hidden">
          <div className="px-6 py-4">
            <h3 className="text-2xl font-semibold text-gray-800">Detailed Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 text-[10px] tracking-wider uppercase">No.</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 text-[10px] tracking-wider uppercase">Question</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 text-[10px] tracking-wider uppercase">Candidate Answer</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 text-[10px] tracking-wider uppercase">Correct Answer</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 text-[10px] tracking-wider uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map((question, index) => {
                  const userAnswer = selectedAnswers[question.id];
                  const isCorrect = userAnswer === question.answer;
                  return (
                    <tr key={index} className={isCorrect ? 'bg-green-50' : 'bg-red-400'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{question.text}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{userAnswer || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{question.answer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className={`px-2 py-2 text-xs font-semibold rounded-full ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line>
            </svg>
            Download Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
