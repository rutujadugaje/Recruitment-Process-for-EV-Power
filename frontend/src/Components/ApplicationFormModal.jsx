import { useState, useEffect, useRef } from 'react';
import { FaUpload, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const ApplicationFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    mobile: '',
    email: '',
    graduation: '',
    cgpa: '',
    position: '',
    resume: null,
  });

  const [fieldFocused, setFieldFocused] = useState({
    firstName: false,
    lastName: false,
    address: false,
    mobile: false,
    email: false,
    graduation: false,
    cgpa: false,
    position: false,
    resume: false
  });

  const [showResponse, setShowResponse] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleFocus = (field) => {
    setFieldFocused(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleBlur = (field) => {
    if (!formData[field]) {
      setFieldFocused(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  const isBasicInfoValid = (
    formData.firstName &&
    formData.lastName &&
    formData.address &&
    formData.mobile &&
    formData.email &&
    formData.graduation &&
    formData.cgpa &&
    formData.position &&
    formData.resume
  );

  const isFormValid = isBasicInfoValid;

  const handleSubmit = async () => {
    try {
      const {
        firstName,
        lastName,
        address,
        mobile,
        email,
        graduation,
        cgpa,
        position,
        resume, 
      } = formData;

      const form = new FormData();
      form.append("firstName", firstName);
      form.append("lastName", lastName);
      form.append("address", address);
      form.append("mobile", mobile);
      form.append("email", email);
      form.append("graduation", graduation);
      form.append("cgpa", cgpa);
      form.append("position", position);
      form.append("resume", resume);

      const response = await axios.post("http://localhost:5000/api/applicationform", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Show the response component instead of navigating
      setShowResponse(true);
      console.log(response.data);
      
    } catch (error) {
      toast.error(error.response?.data?.error || "Submission failed.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.error("Error submitting form:", error.response?.data || error.message);
    }
  };

  // FormResponse Component integrated directly
  const FormResponse = () => {
    const [isVisible, setIsVisible] = useState(true);
    const homeLinkRef = useRef(null);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setShowResponse(false);
        onClose();
        if (homeLinkRef.current) {
          homeLinkRef.current.click();
        }
      }, 5000);

      return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1001]">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
            <p className="text-gray-600 text-center mb-6">
              Your form has been submitted successfully. Our team will connect with you shortly.
            </p>
            <Link
              to="/"
              ref={homeLinkRef}
              onClick={() => {
                setIsVisible(false);
                setShowResponse(false);
                onClose();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

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
      
      {showResponse ? (
        <FormResponse />
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl my-16 relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
            >
              <FaTimes className="text-xl" />
            </button>
            
            <div className="p-6">
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Application Form</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    onFocus={() => handleFocus('firstName')}
                    onBlur={() => handleBlur('firstName')}
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    onFocus={() => handleFocus('lastName')}
                    onBlur={() => handleBlur('lastName')}
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="relative mb-4">
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  onFocus={() => handleFocus('address')}
                  onBlur={() => handleBlur('address')}
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    onFocus={() => handleFocus('mobile')}
                    onBlur={() => handleBlur('mobile')}
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>
                
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <label 
                    htmlFor="graduation" 
                    className={`absolute left-3 transition-all duration-200 ${
                      fieldFocused.graduation || formData.graduation 
                        ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2'
                        : 'top-1/2 text-gray-500 -translate-y-1/2'
                    }`}
                  >
                    Graduation
                  </label>
                  <input
                    id="graduation"
                    type="text"
                    name="graduation"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    onFocus={() => handleFocus('graduation')}
                    onBlur={() => handleBlur('graduation')}
                    value={formData.graduation}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="relative">
                  <label 
                    htmlFor="cgpa" 
                    className={`absolute left-3 transition-all duration-200 ${
                      fieldFocused.cgpa || formData.cgpa 
                        ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2'
                        : 'top-1/2 text-gray-500 -translate-y-1/2'
                    }`}
                  >
                    CGPA
                  </label>
                  <input
                    id="cgpa"
                    type="number"
                    name="cgpa"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    onFocus={() => handleFocus('cgpa')}
                    onBlur={() => handleBlur('cgpa')}
                    value={formData.cgpa}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="relative mb-4">
                <label 
                  htmlFor="position" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Position
                </label>
                <select
                  id="position"
                  name="position"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  value={formData.position}
                  onChange={handleChange}
                >
                  <option value="" disabled className="text-gray-400">Select</option>
                  <option value="Electric Engineer">Electric Engineer</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="EV Designer Engineer">EV Designer Engineer</option>
                  <option value="Data Analyst">Data Analyst</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume</label>
                <div className="flex items-center">
                  <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                    <FaUpload className="text-gray-500 text-2xl mb-2" />
                    <span className="text-sm text-gray-600">
                      {formData.resume ? formData.resume.name : 'Choose a file'}
                    </span>
                    <input 
                      type="file" 
                      name="resume"
                      className="hidden"
                      onChange={handleChange}
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!isFormValid}
                onClick={handleSubmit}
                className={`w-full py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors mb-2 ${
                  isFormValid 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationFormModal;