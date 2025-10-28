import { Link, useLocation } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import {
  FiHome, FiUsers, FiBriefcase, FiCalendar, FiSettings, FiBell, FiSearch, FiMenu, FiChevronDown,
  FiPieChart, FiClock, FiEdit, FiEye, FiAward, FiClipboard, FiUserCheck, FiUserPlus,
} from 'react-icons/fi';
import Results from './Results';

const EmployeeTableRow = ({ employee }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-indigo-800 font-medium">{employee.name.split(' ').map(n => n[0]).join('')}</span>
        </div>
        <div className="ml-4 text-sm font-medium text-gray-900">{employee.name}</div>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-gray-900">{employee.position}</td>
    <td className="px-6 py-4">
      <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">{employee.department}</span>
    </td>
    <td className="px-6 py-4">
      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {employee.status}
      </span>
    </td>
    <td className="px-6 py-4 text-sm text-gray-500">
      <button className="text-indigo-600 hover:text-indigo-900 mr-3 p-1" title="Edit"><FiEdit /></button>
      <button className="text-gray-600 hover:text-gray-900 p-1" title="View"><FiEye /></button>
    </td>
  </tr>
);

const UserTestsTable = ({ setActiveTab, setSelectedTest }) => {
  const [userTests, setUserTests] = useState([]);
  const { state } = useLocation();

  useEffect(() => {
    const tests = state?.allTests || JSON.parse(localStorage.getItem('userTests') || '[]');
    setUserTests(tests);
  }, [state]);

  const handleViewResults = (test) => {
    setSelectedTest(test);
    setActiveTab('test-results');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Aptitude Result ({userTests.length})</h3>
        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">Total: {userTests.length}</span>
      </div>
      {userTests.length > 0 ? (
        <div className="overflow-x-auto">
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
            <tbody className="divide-y divide-gray-200">
              {userTests.map((test, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{test.email || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(test.testDate).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{test.score}/{test.totalQuestions}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${test.percentage >= 70 ? 'bg-green-100 text-green-800' : test.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {test.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{Math.floor(test.timeSpent / 60)}m {test.timeSpent % 60}s</td>
                  <td className="px-6 py-4 text-sm">
                    <button onClick={() => handleViewResults(test)} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No test attempts found</p>
          <Link to="/" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block">Take a Test</Link>
        </div>
      )}
    </div>
  );
};

const HRDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const { state } = useLocation();

  // Get logged-in user info from localStorage
  const loggedInUser = {
    name: localStorage.getItem('user_name') || 'HR User',
    email: localStorage.getItem('user_email') || 'hr@evpower.com',
    role: localStorage.getItem('user_role') || 'hr',
    initials: (localStorage.getItem('user_name') || 'HR').split(' ').map(n => n[0]).join('')
  };

  useEffect(() => {
    if (state?.activeTab) setActiveTab(state.activeTab);
  }, [state]);

  const baseEmployees = useMemo(() => [
    { id: 1, name: 'Rutuja Dugaje', position: 'Backend Developer', department: 'Electric Engineer', status: 'active', joinedDate: '2025-11-15' },
    { id: 2, name: 'Shivani Patil', position: 'Digital Marketing', department: 'EV Designer Engineer', status: 'active', joinedDate: '2025-09-20' },
    { id: 3, name: 'Darshan Nirghude', position: 'Product Designer', department: 'Engineer', status: 'on leave', joinedDate: '2025-09-10' },
    { id: 4, name: 'Jay Baste', position: 'Frontend Developer', department: 'Software Engineer', status: 'active', joinedDate: '2025-11-27' },
    { id: 5, name: 'Bhushan Barhate', position: 'Marketing Specialist', department: 'Data Analyst', status: 'active', joinedDate: '2025-07-05' },
    { id: 6, name: 'Adinath Jadhav', position: 'Sales Executive', department: 'Sales', status: 'active', joinedDate: '2025-09-07' },
    { id: 7, name: 'Sagar Wadje', position: 'DevOps Engineer', department: 'Marketing', status: 'active', joinedDate: '2025-10-07' },
    { id: 8, name: 'Chaitanya Rao', position: 'UX Designer', department: 'Design', status: 'active', joinedDate: '2024-12-01' },
    { id: 9, name: 'Diya Nair', position: 'HR Specialist', department: 'Human Resources', status: 'on leave', joinedDate: '2024-05-22' },
    { id: 10, name: 'Eshan Kumar', position: 'Backend Developer', department: 'Engineering', status: 'active', joinedDate: '2025-02-15' },
    { id: 11, name: 'Fiona Shah', position: 'Content Writer', department: 'Marketing', status: 'active', joinedDate: '2024-10-03' },
    { id: 12, name: 'Gaurav Reddy', position: 'QA Engineer', department: 'Engineering', status: 'active', joinedDate: '2024-04-18' },
    { id: 13, name: 'Hansa Agarwal', position: 'Financial Analyst', department: 'Finance', status: 'active', joinedDate: '2025-04-09' },
    { id: 14, name: 'Ishan Jain', position: 'Project Manager', department: 'Product', status: 'suspended', joinedDate: '2024-03-25' },
    { id: 15, name: 'Jaya Verma', position: 'Data Scientist', department: 'Data Science', status: 'active', joinedDate: '2024-07-30' },
    { id: 16, name: 'Karan Malhotra', position: 'Network Engineer', department: 'IT', status: 'active', joinedDate: '2025-05-01' },
    { id: 17, name: 'Lila Thakur', position: 'Graphic Designer', department: 'Design', status: 'active', joinedDate: '2024-11-12' },
    { id: 18, name: 'Mohan Yadav', position: 'Sales Manager', department: 'Sales', status: 'active', joinedDate: '2024-06-28' },
    { id: 19, name: 'Neha Kulkarni', position: 'Business Analyst', department: 'Product', status: 'on leave', joinedDate: '2024-08-15' },
    { id: 20, name: 'Omkar Pawar', position: 'Cloud Architect', department: 'Engineering', status: 'active', joinedDate: '2025-02-20' },
    { id: 21, name: 'Priya Bhatt', position: 'Digital Marketer', department: 'Marketing', status: 'active', joinedDate: '2024-09-05' },
    { id: 22, name: 'Rahul Iyer', position: 'Security Analyst', department: 'IT', status: 'active', joinedDate: '2024-12-20' },
    { id: 23, name: 'Sanya Kapoor', position: 'UI Developer', department: 'Engineering', status: 'active', joinedDate: '2025-03-08' },
    { id: 24, name: 'Tarun Das', position: 'Accountant', department: 'Finance', status: 'active', joinedDate: '2024-04-10' },
    { id: 25, name: 'Uma Rathi', position: 'Customer Support', department: 'Support', status: 'active', joinedDate: '2024-10-25' },
    { id: 26, name: 'Vikram Chauhan', position: 'Machine Learning Engineer', department: 'Data Science', status: 'active', joinedDate: '2025-01-15' },
    { id: 27, name: 'Yashvi Saxena', position: 'Product Designer', department: 'Design', status: 'on leave', joinedDate: '2024-05-30' },
    { id: 28, name: 'Zara Khan', position: 'Operations Manager', department: 'Operations', status: 'active', joinedDate: '2024-07-12' },
    { id: 29, name: 'Akash Bose', position: 'Full Stack Developer', department: 'Engineering', status: 'active', joinedDate: '2025-04-22' },
    { id: 30, name: 'Bina Roy', position: 'HR Manager', department: 'Human Resources', status: 'active', joinedDate: '2024-03-18' },
  ], []);

  const upcomingEvents = useMemo(() => [
    { id: 1, title: 'Team Meeting', date: 'Today, 2:00 PM', type: 'meeting' },
    { id: 2, title: 'New Hire Orientation', date: 'Jun 15, 10:00 AM', type: 'event' },
  ], []);

  const stats = useMemo(() => [
    { title: 'Total Employees', value: baseEmployees.length, change: '+5%', icon: <FiUsers className="text-blue-500" /> },
    { title: 'Open Positions', value: '112', change: '-2', icon: <FiBriefcase className="text-purple-500" /> },
    { title: 'On Leave', value: baseEmployees.filter(e => e.status === 'on leave').length, change: '+3', icon: <FiClock className="text-yellow-500" /> },
    { title: 'Avg. Satisfaction', value: '4.6', change: '+0.2', icon: <FiPieChart className="text-green-500" /> },
  ], [baseEmployees]);

  const filteredEmployees = useMemo(() =>
    baseEmployees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    ), [baseEmployees, searchTerm]);

  const recentEmployeesForDashboard = useMemo(() => filteredEmployees.slice(0, 4), [filteredEmployees]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-400 to-white text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-indigo-700 border-opacity-50">
          {sidebarOpen ? (
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-200">HR<span className="text-white">Pro</span></h1>
          ) : (
            <h1 className="text-2xl font-bold text-white mx-auto">H</h1>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-full hover:bg-indigo-700"><FiMenu className="text-xl" /></button>
        </div>
        <nav className="mt-8 flex-grow">
          {[
            { icon: <FiHome />, name: 'Dashboard', id: 'dashboard' },
            { icon: <FiUsers />, name: 'Employees', id: 'employees' },
            { icon: <FiUserPlus />, name: 'Recruitment', id: 'recruitment' },
            { icon: <FiClipboard />, name: 'Result', id: 'results' },
            { icon: <FiAward />, name: 'Interview Result', id: 'interviewresults' },
            { icon: <FiUserCheck />, name: 'Joining Process', id: 'joining-process' },
          ].map(item => (
            <Link
              key={item.id}
              to={`#${item.id}`}
              onClick={() => { setActiveTab(item.id); setSelectedTest(null); }}
              className={`flex items-center w-full p-3 ${sidebarOpen ? 'px-6' : 'justify-center'} transition-colors duration-200 ${activeTab === item.id ? 'text-black bg-blue-400 hover:bg-opacity-50' : 'text-black hover:bg-blue-400 hover:bg-opacity-50'}`}
              title={sidebarOpen ? '' : item.name}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
        <div className={`p-3 ${sidebarOpen ? 'border-t border-indigo-700 border-opacity-50' : ''}`}>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full p-3 ${sidebarOpen ? 'px-6' : 'justify-center'} transition-colors duration-200 ${activeTab === 'settings' ? 'text-black' : 'text-black hover:bg-indigo-700 hover:bg-opacity-50'}`}
            title={sidebarOpen ? '' : 'Settings'}
          >
            <span className="text-xl"><FiSettings /></span>
            {sidebarOpen && <span className="ml-3">Settings</span>}
          </button>
        </div>
        {sidebarOpen && (
          <div className="p-4 bg-opacity-50 border-t border-opacity-50">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-lg font-semibold text-white">{loggedInUser.initials}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-black font-bold">{loggedInUser.name}</p>
                <p className="text-xs text-black">HR Manager</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {activeTab === 'dashboard' ? 'HR Dashboard' : activeTab === 'test-results' ? 'Test Results' : activeTab.replace('-', ' ')}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 pr-4 py-2 w-48 sm:w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 rounded-full hover:bg-gray-100 relative">
                  <FiBell className="text-xl text-gray-600" />
                  {upcomingEvents.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800">Notifications ({upcomingEvents.length})</h3>
                    </div>
                    <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                      {upcomingEvents.length > 0 ? upcomingEvents.slice(0, 5).map(event => (
                        <div key={event.id} className="p-3 hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm font-medium text-gray-700">{event.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                        </div>
                      )) : (
                        <p className="text-sm text-gray-500 p-4 text-center">No new notifications.</p>
                      )}
                    </div>
                    {upcomingEvents.length > 0 && (
                      <div className="p-3 text-center text-sm text-indigo-600 font-medium hover:bg-gray-50 cursor-pointer border-t border-gray-200">View All</div>
                    )}
                  </div>
                )}
              </div>
              <div className="relative">
                <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-800 font-medium">{loggedInUser.initials}</span>
                  </div>
                  <FiChevronDown className="text-gray-600" />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-1">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-800">{loggedInUser.name}</p>
                      <p className="text-xs text-gray-500">HR Manager</p>
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-indigo-100 transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <p className="text-3xl font-semibold text-gray-800 mt-1">{stat.value}</p>
                        <p className={`text-xs mt-1 font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</p>
                      </div>
                      <div className="p-3 bg-indigo-50 rounded-lg text-2xl">{stat.icon}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Upcoming Events</h3>
                    {upcomingEvents.length > 0 && <button onClick={() => setActiveTab('timeoff')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</button>}
                  </div>
                  <div className="space-y-4 max-h-72 overflow-y-auto">
                    {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                      <div key={event.id} className="flex items-start p-3 rounded-lg hover:bg-gray-50">
                        <div className={`p-2.5 rounded-lg mr-4 text-xl ${event.type === 'meeting' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}><FiCalendar /></div>
                        <div>
                          <p className="font-medium text-gray-800">{event.title}</p>
                          <p className="text-xs text-gray-500">{event.date}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="flex items-center justify-center h-40 text-gray-500">No upcoming events.</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Employees Activity ({recentEmployeesForDashboard.length})</h3>
                  <button onClick={() => setActiveTab('employees')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
                </div>
                {recentEmployeesForDashboard.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Department</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentEmployeesForDashboard.map(employee => <EmployeeTableRow key={employee.id} employee={employee} />)}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">{searchTerm ? `No employees found matching "${searchTerm}".` : 'No recent employees to display.'}</p>
                )}
              </div>
            </>
          )}
          {activeTab === 'employees' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">All Employees ({filteredEmployees.length})</h3>
              </div>
              {filteredEmployees.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEmployees.map(employee => <EmployeeTableRow key={employee.id} employee={employee} />)}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-10">{searchTerm ? `No employees found matching "${searchTerm}".` : 'No employees in the system.'}</p>
              )}
            </div>
          )}
          {activeTab === 'results' && <UserTestsTable setActiveTab={setActiveTab} setSelectedTest={setSelectedTest} />}
          {activeTab === 'test-results' && selectedTest && (
            <Results
              questions={selectedTest.questions || []}
              selectedAnswers={selectedTest.selectedAnswers || {}}
              timeSpent={`${Math.floor(selectedTest.timeSpent / 60)}m ${selectedTest.timeSpent % 60}s`}
              email={selectedTest.email}
              testDate={selectedTest.testDate}
            />
          )}
          {['recruitment', 'interviewresults', 'joining-process', 'settings'].includes(activeTab) && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 capitalize">{activeTab.replace('-', ' ')}</h3>
              <div className="text-gray-600 space-y-4">
                <p>The <strong className="font-medium">{activeTab.replace('-', ' ')}</strong> section is under development.</p>
                <p>We're working on a comprehensive interface for managing {activeTab.replace('-', ' ')}. Check back soon!</p>
                <div className="flex items-center justify-center text-indigo-500 mt-8">
                  <FiClock size={48} className="mr-4" />
                  <FiSettings size={48} className="animate-spin-slow" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;