import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaUserTie, FaUserShield } from 'react-icons/fa';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [fieldFocused, setFieldFocused] = useState({ 
    email: false, 
    password: false 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field) => setFieldFocused(prev => ({ ...prev, [field]: true }));
  const handleBlur = (field) => {
    if (!formData[field]) setFieldFocused(prev => ({ ...prev, [field]: false }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const isFormValid = formData.email && formData.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!loginType) {
      toast.error('Please select a login type');
      return;
    }

    setLoading(true);
    try {
      const loginData = { 
        email: formData.email.trim(), 
        password: formData.password, 
        role: loginType 
      };
      
      console.log('🔄 Sending login request:', loginData);
      
      const res = await axios.post(`http://localhost:8000/api/admin-login`, loginData);
      
      toast.success(`Login successful! Welcome ${res.data.full_name}`, {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Store token and user info
      localStorage.setItem('admin_token', res.data.access_token);
      localStorage.setItem('user_role', res.data.role);
      localStorage.setItem('user_email', res.data.email);
      localStorage.setItem('user_name', res.data.full_name);
      
      onClose();
      
      // Navigate to appropriate dashboard
      setTimeout(() => {
        if (res.data.role === 'admin') {
          navigate('/admindashboard');
        } else {
          navigate('/hr-dashboard');
        }
      }, 1000);
      
    } catch (err) {
      console.error('❌ Login error:', err.response?.data);
      const errorMsg = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setLoginType(role);
    // Pre-fill email based on role for easier testing
    const email = role === 'admin' ? 'sandipbaste999@gmail.com' : 'dugajerutuja@gmail.com';
    setFormData({ email, password: 'root@123' });
    setFieldFocused({ email: true, password: false });
  };

  const handleBackToRoleSelection = () => {
    setLoginType(null);
    setFormData({ email: '', password: '' });
    setFieldFocused({ email: false, password: false });
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
            onClick={onClose}
          >
            ✕
          </button>

          {/* Role Selection Screen */}
          {!loginType && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Login Type</h2>
              <div className="space-y-4">
                <button
                  onClick={() => handleRoleSelect('hr')}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-3 hover:shadow-lg"
                >
                  <FaUserTie className="text-xl" />
                  <span>HR Login</span>
                </button>
                
                <button
                  onClick={() => handleRoleSelect('admin')}
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-3 hover:shadow-lg"
                >
                  <FaUserShield className="text-xl" />
                  <span>Admin Login</span>
                </button>
              </div>
              
              {/* Demo Credentials Info */}
              <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Test Credentials (Auto-filled):</strong><br />
                  • Admin: sandipbaste999@gmail.com / root@123<br />
                  • HR: dugajerutuja@gmail.com / root@123
                </p>
              </div>
            </div>
          )}

          {/* Login Form Screen */}
          {loginType && (
            <>
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBackToRoleSelection}
                  className="text-gray-600 hover:text-gray-800 mr-3"
                >
                  ← Back
                </button>
                <h2 className="text-2xl font-bold text-gray-800 flex-1 text-center">
                  {loginType === 'hr' ? 'HR Login' : 'Admin Login'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <FaEnvelope />
                  </div>
                  <label htmlFor="email"
                    className={`absolute left-10 px-1 bg-white transition-all duration-200 ${
                      fieldFocused.email || formData.email
                        ? 'top-0 text-sm text-blue-500 -translate-y-1/2'
                        : 'top-3.5 text-gray-400'
                    }`}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    onChange={handleChange}
                    value={formData.email}
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <FaLock />
                  </div>
                  <label htmlFor="password"
                    className={`absolute left-10 px-1 bg-white transition-all duration-200 ${
                      fieldFocused.password || formData.password
                        ? 'top-0 text-sm text-blue-500 -translate-y-1/2'
                        : 'top-3.5 text-gray-400'
                    }`}>
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full py-3 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onFocus={() => handleFocus('password')}
                    onBlur={() => handleBlur('password')}
                    onChange={handleChange}
                    value={formData.password}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`w-full py-3 font-semibold rounded-lg transition-all ${
                    isFormValid && !loading
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Logging in...
                    </div>
                  ) : (
                    `Login as ${loginType.toUpperCase()}`
                  )}
                </button>

                {/* Quick Info */}
                <div className="text-center text-sm text-gray-600">
                  Currently logged in as: <strong>{formData.email}</strong>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;