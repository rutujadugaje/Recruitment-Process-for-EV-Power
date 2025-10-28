import { useState, useMemo } from 'react';
import { FaUserShield } from 'react-icons/fa';
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiDatabase,
  FiShield,
  FiActivity,
  FiBarChart2,
  FiAlertCircle,
  FiLogOut,
  FiMenu,
  FiChevronDown,
  FiBell,
  FiSearch,
  FiUserPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiBriefcase,
  FiClock,
  FiPieChart,
  FiClipboard,
} from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Helper component for user table rows
const UserTableRow = ({ user, onEdit, onDelete }) => (
  <tr key={user.id} className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-indigo-800 font-medium">
            {user.name.split(' ').map((n) => n[0]).join('')}
          </span>
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{user.position}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
        {user.department}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          user.status === 'active'
            ? 'bg-green-100 text-green-800'
            : user.status === 'suspended'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {user.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
      <button
        onClick={() => onEdit(user)}
        className="text-indigo-600 hover:text-indigo-900 mr-3 p-1"
        title="Edit"
      >
        <FiEdit2 />
      </button>
      <button
        onClick={() => onDelete(user)}
        className="text-red-600 hover:text-red-900 p-1"
        title="Delete"
      >
        <FiTrash2 />
      </button>
    </td>
  </tr>
);

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Get logged-in user info from localStorage
  const loggedInUser = {
    name: localStorage.getItem('user_name') || 'Admin User',
    email: localStorage.getItem('user_email') || 'admin@evpower.com',
    role: localStorage.getItem('user_role') || 'admin',
    initials: (localStorage.getItem('user_name') || 'AD').split(' ').map(n => n[0]).join('')
  };

  // Sample data
  const employees = useMemo(
    () => [
      {
        id: 1,
        name: 'Rutuja Dugaje',
        position: 'Backend Developer',
        department: 'Electric Engineer',
        status: 'active',
        email: 'rutuja.dugaje@example.com',
        joinedDate: '2025-11-15',
      },
      {
        id: 2,
        name: 'Shivani Patil',
        position: 'Digital Marketing',
        department: 'EV Designer Engineer',
        status: 'active',
        email: 'shivani.patil@example.com',
        joinedDate: '2025-09-20',
      },
      {
        id: 3,
        name: 'Darshan Nirghude',
        position: 'Product Designer',
        department: 'Engineer',
        status: 'on leave',
        email: 'darshan.nirghude@example.com',
        joinedDate: '2025-09-10',
      },
      {
        id: 4,
        name: 'Jay Baste',
        position: 'Frontend Developer',
        department: 'Software Engineer',
        status: 'active',
        email: 'jay.baste@example.com',
        joinedDate: '2025-11-27',
      },
      {
        id: 5,
        name: 'Bhushan Barhate',
        position: 'Marketing Specialist',
        department: 'Data Analyst',
        status: 'active',
        email: 'bhushan.barhate@example.com',
        joinedDate: '2025-07-05',
      },
    ],
    []
  );

  const hrEmployees = useMemo(
    () => [
      { id: 9, name: 'Diya Nair', position: 'HR Specialist', department: 'Human Resources', status: 'on leave', email: 'diya.nair@example.com', joinedDate: '2024-05-22' },
      { id: 30, name: 'Bina Roy', position: 'HR Manager', department: 'Human Resources', status: 'active', email: 'bina.roy@example.com', joinedDate: '2024-03-18' },
    ],
    []
  );

  const systemAlerts = useMemo(
    () => [
      { id: 1, title: 'Database backup required', severity: 'high', date: 'Today, 10:30 AM' },
      { id: 2, title: 'New system update available', severity: 'medium', date: 'Yesterday, 3:45 PM' },
    ],
    []
  );

  const stats = useMemo(
    () => [
      {
        title: 'Total HR',
        value: hrEmployees.length,
        change: '+9%',
        icon: <FaUserShield className="text-indigo-600" />,
      },
      {
        title: 'Total Employees',
        value: employees.length,
        change: '+12%',
        icon: <FiUsers className="text-indigo-600" />,
      },
      {
        title: 'Open Positions',
        value: '112',
        change: '-2%',
        icon: <FiBriefcase className="text-purple-600" />,
      },
      {
        title: 'On Leave',
        value: [...employees, ...hrEmployees].filter((e) => e.status === 'on leave').length,
        change: '+3%',
        icon: <FiClock className="text-yellow-600" />,
      },
      {
        title: 'Avg. Satisfaction',
        value: '4.6',
        change: '+0.2',
        icon: <FiPieChart className="text-green-600" />,
      },
      {
        title: 'Active Sessions',
        value: '24',
        change: '+5',
        icon: <FiActivity className="text-green-600" />,
      },
      {
        title: 'System Alerts',
        value: systemAlerts.length,
        change: '+2',
        icon: <FiAlertCircle className="text-yellow-600" />,
      },
      {
        title: 'Storage Used',
        value: '78%',
        change: '+8%',
        icon: <FiDatabase className="text-purple-600" />,
      },
    ],
    [employees, hrEmployees, systemAlerts]
  );

  const filteredUsers = useMemo(
    () => {
      if (!searchTerm) return [...employees, ...hrEmployees];
      return [...employees, ...hrEmployees].filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [employees, hrEmployees, searchTerm]
  );

  const roleDistribution = useMemo(
    () => {
      const counts = filteredUsers.reduce((acc, user) => {
        acc[user.position] = (acc[user.position] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(counts).map(([position, count]) => ({
        role: position,
        count,
        percentage: (count / filteredUsers.length) * 100,
      }));
    },
    [filteredUsers]
  );

  // Chart data for Analytics tab
  const chartData = {
    labels: ['Total HR', 'Total Employees', 'Open Positions', 'On Leave'],
    datasets: [
      {
        label: 'Count',
        data: [
          hrEmployees.length,
          employees.length,
          112,
          [...employees, ...hrEmployees].filter((e) => e.status === 'on leave').length,
        ],
        backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'],
        borderColor: ['#4338CA', '#059669', '#D97706', '#DC2626'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#1F2937',
          font: { size: 14 },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1F2937',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#4B5563',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#1F2937', font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#1F2937', font: { size: 12 }, stepSize: 10 },
        grid: { color: '#E5E7EB', borderDash: [5, 5] },
      },
    },
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (user) => {
    console.log('Deleting user:', user.id);
    alert(`User ${user.name} would be deleted in a real application`);
  };

  const handleSaveUser = () => {
    console.log('Saving user:', currentUser);
    setShowUserModal(false);
    setCurrentUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-400 to-white text-black transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {sidebarOpen ? (
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
              Admin<span className="text-black">Pro</span>
            </h2>
          ) : (
            <h2 className="text-2xl font-bold text-black mx-auto">A</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
          >
            <FiMenu className="text-xl" />
          </button>
        </div>

        <nav className="mt-8 flex-grow">
          {[
            { icon: <FiHome />, name: 'Dashboard', id: 'dashboard' },
            { icon: <FiUsers />, name: 'Employees', id: 'users' },
            { icon: <FiClipboard />, name: 'Result', id: 'Result' },
            { icon: <FiDatabase />, name: 'Database', id: 'database' },
            { icon: <FiShield />, name: 'Security', id: 'security' },
            { icon: <FiBarChart2 />, name: 'Analytics', id: 'analytics' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full p-3 transition-colors duration-200 ${
                sidebarOpen ? 'px-6' : 'justify-center'
              } ${
                activeTab === item.id
                  ? 'bg-blue-400 text-black'
                  : 'text-black hover:bg-blue-400 hover:bg-opacity-50'
              }`}
              title={sidebarOpen ? '' : item.name}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className={`p-3 ${sidebarOpen ? 'border-t border-gray-200' : ''}`}>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full p-3 transition-colors duration-200 ${
              sidebarOpen ? 'px-6' : 'justify-center'
            } ${
              activeTab === 'settings'
                ? 'bg-gray-600 text-white'
                : 'text-black hover:bg-gray-600 hover:bg-opacity-50'
            }`}
            title={sidebarOpen ? '' : 'Settings'}
          >
            <FiSettings className="text-xl" />
            {sidebarOpen && <span className="ml-3">Settings</span>}
          </button>
        </div>

        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-lg font-semibold text-white">{loggedInUser.initials}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-gray-800">{loggedInUser.name}</p>
                <p className="text-xs text-gray-600">Admin</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {activeTab === 'dashboard' ? 'Admin Dashboard' : activeTab.replace('-', ' ')}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 w-48 sm:w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 relative focus:outline-none"
                >
                  <FiBell className="text-xl text-gray-600" />
                  {systemAlerts.length > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800">
                        System Alerts ({systemAlerts.length})
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                      {systemAlerts.length > 0 ? (
                        systemAlerts.map((alert) => (
                          <div key={alert.id} className="p-3 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-start">
                              <div
                                className={`p-1.5 rounded-full mr-3 ${
                                  alert.severity === 'high'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-yellow-100 text-yellow-600'
                                }`}
                              >
                                <FiAlertCircle />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">{alert.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{alert.date}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 p-4 text-center">No system alerts.</p>
                      )}
                    </div>
                    {systemAlerts.length > 0 && (
                      <div className="p-3 text-center text-sm text-indigo-600 font-medium hover:bg-gray-50 cursor-pointer border-t border-gray-200">
                        View All Alerts
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-800 font-semibold">{loggedInUser.initials}</span>
                  </div>
                  <FiChevronDown className="text-gray-600" />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-1">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">{loggedInUser.name}</p>
                      <p className="text-xs text-gray-500">Super Admin</p>
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Profile
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Account Settings
                    </a>
                    <div className="border-t border-gray-200 my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-600 hover:shadow-xl transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p
                          className={`text-sm ${
                            stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {stat.change}
                        </p>
                      </div>
                      <div className="text-2xl">{stat.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts and Tables */}
              <div className=" mb-8">
                {/* System Alerts */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
                    {systemAlerts.length > 0 && (
                      <button
                        onClick={() => setActiveTab('system')}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        View All Alerts
                      </button>
                    )}
                  </div>
                  <div className="space-y-4 max-h-72 overflow-y-auto">
                    {systemAlerts.length > 0 ? (
                      systemAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-start p-3 rounded-lg hover:bg-gray-50"
                        >
                          <div
                            className={`p-2 rounded-lg mr-3 text-lg ${
                              alert.severity === 'high'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-yellow-100 text-yellow-600'
                            }`}
                          >
                            <FiAlertCircle />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{alert.title}</p>
                            <p className="text-xs text-gray-500">{alert.date}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-40 text-gray-600">
                        No system alerts. Everything looks good!
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Employee Activity</h3>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View All Employees
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.slice(0, 5).map((user) => (
                        <UserTableRow
                          key={user.id}
                          user={user}
                          onEdit={handleEditUser}
                          onDelete={handleDeleteUser}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  All Employees ({filteredUsers.length})
                </h3>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setShowUserModal(true);
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center"
                >
                  <FiUserPlus className="mr-2" /> Add Employee
                </button>
              </div>
              {filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <UserTableRow
                          key={user.id}
                          user={user}
                          onEdit={handleEditUser}
                          onDelete={handleDeleteUser}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-600 py-10">
                  {searchTerm
                    ? `No employees found matching "${searchTerm}".`
                    : 'There are no employees in the system yet.'}
                </p>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Analytics Overview</h3>
              <div className="max-w-2xl mx-auto">
                <Bar data={chartData} options={chartOptions} />
              </div>
              <p className="text-gray-600 mt-4 text-center">
                This chart displays key HR metrics: Total HR, Total Employees, Open Positions, and
                Employees On Leave.
              </p>
            </div>
          )}

          {activeTab === 'Result' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Result</h3>
              <div className="text-gray-600 space-y-4">
                <p>
                  The <strong className="font-semibold">Result</strong> section provides administrative
                  controls for managing system results.
                </p>
                <p>
                  This area is designed to give administrators comprehensive tools to monitor and
                  review results data.
                </p>
                <div className="flex items-center justify-center text-indigo-600">
                  <FiSettings className="text-4xl animate-spin-slow" />
                </div>
              </div>
            </div>
          )}

          {['database', 'security', 'settings'].includes(activeTab) && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
                {activeTab.replace('-', ' ')}
              </h3>
              <div className="text-gray-600 space-y-4">
                <p>
                  The{' '}
                  <strong className="font-semibold">{activeTab.replace('-', ' ')}</strong> section
                  provides administrative controls for system management.
                </p>
                <p>
                  This area is designed to give administrators comprehensive tools to monitor and
                  configure all aspects of the {activeTab.replace('-', ' ')} system.
                </p>
                <div className="flex items-center justify-center text-indigo-600">
                  <FiSettings className="text-4xl animate-spin-slow" />
                </div>
              </div>
            </div>
          )}
        </main>

        {/* User Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {currentUser ? 'Edit Employee' : 'Add Employee'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={currentUser?.name || ''}
                      onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={currentUser?.email || ''}
                      onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={currentUser?.position || ''}
                      onChange={(e) => setCurrentUser({ ...currentUser, position: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={currentUser?.department || ''}
                      onChange={(e) => setCurrentUser({ ...currentUser, department: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={currentUser?.status || 'active'}
                      onChange={(e) => setCurrentUser({ ...currentUser, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  {!currentUser?.id && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Set initial password..."
                        />
                        <button className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700">
                          <FiEye />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save Employee
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;