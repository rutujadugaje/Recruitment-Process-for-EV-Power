import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // ✅ import useNavigate

const AptitudeLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldFocused, setFieldFocused] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field) => setFieldFocused(prev => ({ ...prev, [field]: true }));
  const handleBlur = (field) => {
    if (!formData[field]) setFieldFocused(prev => ({ ...prev, [field]: false }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`http://localhost:5000/api/user-aptitude-login`, formData);
      toast.success('Login successful!');
      localStorage.setItem('token', res.data.authtoken);
      setTimeout(() => {
        navigate('/onlinetest', 
          {
            state: {
              email: formData.email
            }
          }
        ); // ✅ Redirect after login
        // console.log(formData.email);
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed. Check credentials.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-blue-2000 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <h1 className="text-3xl font-bold text-white">Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Email Input */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <label htmlFor="email" className={`absolute left-10 transition-all duration-200 ${
                fieldFocused.email || formData.email
                  ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2'
                  : 'top-1/2 text-gray-500 -translate-y-1/2'
              }`}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <label htmlFor="password" className={`absolute left-10 transition-all duration-200 ${
                fieldFocused.password || formData.password
                  ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2'
                  : 'top-1/2 text-gray-500 -translate-y-1/2'
              }`}>
                Password
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword
                  ? <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  : <FaEye className="text-gray-400 hover:text-gray-600" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-4 rounded-xl font-bold text-white focus:outline-none transition-all duration-300 shadow-lg ${
                isFormValid && !loading
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AptitudeLogin;
