import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Login';

const SignUp = ({ isOpen, onClose }) => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: 'hr',
  });

  const [fieldFocused, setFieldFocused] = useState({
    firstName: false,
    lastName: false,
    mobile: false,
    email: false,
    address: false,
    password: false,
    confirmPassword: false,
  });

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen || showLogin) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, showLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field) => {
    setFieldFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    if (!formData[field]) {
      setFieldFocused(prev => ({ ...prev, [field]: false }));
    }
  };

  const isFormValid = (
    formData.firstName &&
    formData.lastName &&
    formData.mobile &&
    formData.email &&
    formData.address &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/signup', formData);
      toast.success('Registration successful!');
      onClose();
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
  };

  const handleLoginClick = () => {
    onClose(); // Close signup modal first
    setShowLogin(true); // Then open login modal
  };

  if (!isOpen && !showLogin) return null;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* SignUp Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-2/4 my-16 relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
            >
              <FaTimes className="text-xl" />
            </button>
            
            <div className="p-6">
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h1>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="relative">
                    <label 
                      htmlFor="firstName" 
                      className={`absolute left-3 transition-all duration-200 ${
                        fieldFocused.firstName || formData.firstName 
                          ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2'
                          : 'top-1/2 text-gray-500 -translate-y-1/2'
                      }`}
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onFocus={() => handleFocus('firstName')}
                      onBlur={() => handleBlur('firstName')}
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  {/* Last Name */}
                  <div className="relative">
                    <label 
                      htmlFor="lastName" 
                      className={`absolute left-3 transition-all duration-200 ${
                        fieldFocused.lastName || formData.lastName 
                          ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2'
                          : 'top-1/2 text-gray-500 -translate-y-1/2'
                      }`}
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onFocus={() => handleFocus('lastName')}
                      onBlur={() => handleBlur('lastName')}
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                {/* Mobile */}
                <div className="relative">
                  <label 
                    htmlFor="mobile" 
                    className={`absolute left-3 transition-all duration-200 ${
                      fieldFocused.mobile || formData.mobile 
                        ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2'
                        : 'top-1/2 text-gray-500 -translate-y-1/2'
                    }`}
                  >
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    name="mobile"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onFocus={() => handleFocus('mobile')}
                    onBlur={() => handleBlur('mobile')}
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>
                
                {/* Email */}
                <div className="relative">
                  <label 
                    htmlFor="email" 
                    className={`absolute left-3 transition-all duration-200 ${
                      fieldFocused.email || formData.email 
                        ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2'
                        : 'top-1/2 text-gray-500 -translate-y-1/2'
                    }`}
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                {/* Address */}
                <div className="relative">
                  <label 
                    htmlFor="address" 
                    className={`absolute left-3 transition-all duration-200 ${
                      fieldFocused.address || formData.address 
                        ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2'
                        : 'top-1/2 text-gray-500 -translate-y-1/2'
                    }`}
                  >
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onFocus={() => handleFocus('address')}
                    onBlur={() => handleBlur('address')}
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                
                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="relative">
                    <label 
                      htmlFor="password" 
                      className={`absolute left-3 transition-all duration-200 ${
                        fieldFocused.password || formData.password 
                          ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2'
                          : 'top-1/2 text-gray-500 -translate-y-1/2'
                      }`}
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onFocus={() => handleFocus('password')}
                      onBlur={() => handleBlur('password')}
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  
                  {/* Confirm Password */}
                  <div className="relative">
                    <label 
                      htmlFor="confirmPassword" 
                      className={`absolute left-3 transition-all duration-200 ${
                        fieldFocused.confirmPassword || formData.confirmPassword 
                          ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2'
                          : 'top-1/2 text-gray-500 -translate-y-1/2'
                      }`}
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onFocus={() => handleFocus('confirmPassword')}
                      onBlur={() => handleBlur('confirmPassword')}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                {/* Role Selection */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="role"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="hr">HR Professional</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${
                    isFormValid 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Sign Up
                </button>
              </form>
              
              <p className="mt-4 text-center text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={()=>setShowLogin(true)}
                  className="text-blue-600 font-semibold hover:underline focus:outline-none"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default SignUp;
