import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaUserTie, FaUserShield } from 'react-icons/fa';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import SignUp from './SignUp';

const Login = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldFocused, setFieldFocused] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [loginType, setLoginType] = useState(null); // 'hr' or 'admin' or null for role selection
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
    setLoading(true);
    try {
      // Include the login type in the request
      const loginData = { ...formData, role: loginType };
      const res = await axios.post(`http://localhost:5000/api/login`, loginData);
      toast.success(`${loginType.toUpperCase()} Login successful!`);
      localStorage.setItem('token', res.data.token);
      onClose();
      navigate(res.data.role === 'admin' ? '/admin/dashboard' : '/hr/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed. Check credentials.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setLoginType(role);
    setFormData({ email: '', password: '' }); // Reset form when switching roles
    setFieldFocused({ email: false, password: false });
  };

  const handleBackToRoleSelection = () => {
    setLoginType(null);
    setFormData({ email: '', password: '' });
    setFieldFocused({ email: false, password: false });
  };

  const handleSignUpClick = () => {
    onClose(); // Close login modal first
    setShowSignUp(true); // Then open signup modal
  };

  if (!isOpen && !showSignUp) return null;

  return (
    <>
      <ToastContainer />
      
      {/* Login Modal */}
      {isOpen && (
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
                        ? loginType === 'hr' 
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg'
                          : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {loading ? 'Logging in...' : `Login as ${loginType.toUpperCase()}`}
                  </button>

                  {/* Switch to Signup */}
                  {/* <p className="text-sm text-center text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="text-blue-500 hover:underline"
                      onClick={handleSignUpClick}
                    >
                      Create one
                    </button>
                  </p> */}
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* SignUp Modal */}
      <SignUp 
        isOpen={showSignUp} 
        onClose={() => setShowSignUp(false)} 
        switchToLogin={() => {
          setShowSignUp(false);
          // If you want to reopen login modal after signup closes:
          // onClose();
        }}
      />
    </>
  );
};

export default Login;