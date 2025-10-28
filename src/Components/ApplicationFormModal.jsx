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

  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    address: '',
    mobile: '',
    email: '',
    graduation: '',
    cgpa: '',
    position: '',
    resume: ''
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset form when opening
      setFormData({
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
      setFieldErrors({
        firstName: '',
        lastName: '',
        address: '',
        mobile: '',
        email: '',
        graduation: '',
        cgpa: '',
        position: '',
        resume: ''
      });
      setShowResponse(false);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value || !value.trim()) return 'This field is required';
        if (value.trim().length < 2) return 'Must be at least 2 characters';
        return '';
      
      case 'address':
        if (!value || !value.trim()) return 'Address is required';
        if (value.trim().length < 10) return 'Address must be at least 10 characters';
        return '';
      
      case 'mobile':
        if (!value || !value.trim()) return 'Mobile number is required';
        if (!/^[6-9]\d{9}$/.test(value.trim())) return 'Enter a valid 10-digit mobile number';
        return '';
      
      case 'email':
        if (!value || !value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Enter a valid email address';
        return '';
      
      case 'graduation':
        if (!value || !value.trim()) return 'Graduation field is required';
        if (value.trim().length < 2) return 'Must be at least 2 characters';
        return '';
      
      case 'cgpa':
        if (!value && value !== 0) return 'CGPA is required';
        const cgpaValue = parseFloat(value);
        if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 10) return 'CGPA must be between 0 and 10';
        return '';
      
      case 'position':
        if (!value) return 'Please select a position';
        return '';
      
      case 'resume':
        if (!value) return 'Resume is required';
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    const newValue = type === 'file' ? files[0] : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validate field in real-time
    const error = validateField(name, newValue);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
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
    
    // Validate on blur
    const error = validateField(field, formData[field]);
    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      errors[field] = error;
      if (error) isValid = false;
    });

    setFieldErrors(errors);
    return isValid;
  };

  // FIXED: Proper form validation function
  const isFormValid = () => {
    // Check if all required fields have valid values
    const allFieldsValid = 
      formData.firstName && formData.firstName.trim().length >= 2 &&
      formData.lastName && formData.lastName.trim().length >= 2 &&
      formData.address && formData.address.trim().length >= 10 &&
      formData.mobile && /^[6-9]\d{9}$/.test(formData.mobile.trim()) &&
      formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
      formData.graduation && formData.graduation.trim().length >= 2 &&
      formData.cgpa && !isNaN(parseFloat(formData.cgpa)) && parseFloat(formData.cgpa) >= 0 && parseFloat(formData.cgpa) <= 10 &&
      formData.position &&
      formData.resume;

    // Check if there are no validation errors
    const noErrors = Object.values(fieldErrors).every(error => !error);

    return allFieldsValid && noErrors;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form before submitting.', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    
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
      form.append("firstName", firstName.trim());
      form.append("lastName", lastName.trim());
      form.append("address", address.trim());
      form.append("mobile", mobile.trim());
      form.append("email", email.trim());
      form.append("graduation", graduation.trim());
      form.append("cgpa", cgpa.toString());
      form.append("position", position);
      form.append("resume", resume);

      console.log('🔄 Submitting form to backend...');
      
      const response = await axios.post(
        "http://localhost:8000/api/applicationform", 
        form, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );
      
      console.log('✅ Form submitted successfully:', response.data);
      
      // Show the response component
      setShowResponse(true);
      
    } catch (error) {
      console.error('❌ Error submitting form:', error);
      
      let errorMessage = "Submission failed. Please try again.";
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = "Cannot connect to server. Please make sure the backend is running on port 8000.";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // FormResponse Component
  const FormResponse = () => {
    const [isVisible, setIsVisible] = useState(true);
    const homeLinkRef = useRef(null);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setShowResponse(false);
        onClose();
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
              Your application has been submitted successfully. 
              You will receive an email with aptitude test details shortly.
            </p>
            <button
              onClick={() => {
                setIsVisible(false);
                setShowResponse(false);
                onClose();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl my-8 relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
              disabled={isSubmitting}
            >
              <FaTimes className="text-xl" />
            </button>
            
            <div className="p-6">
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                {isSubmitting ? "Submitting Application..." : "Job Application Form"}
              </h1>
              
              <div className="space-y-4">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label 
                      htmlFor="firstName" 
                      className={`absolute left-3 transition-all duration-200 ${
                        fieldFocused.firstName || formData.firstName 
                          ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2'
                          : 'top-1/2 text-gray-500 -translate-y-1/2'
                      }`}
                    >
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                        fieldErrors.firstName 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                      }`}
                      onFocus={() => handleFocus('firstName')}
                      onBlur={() => handleBlur('firstName')}
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
                    )}
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
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                        fieldErrors.lastName 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                      }`}
                      onFocus={() => handleFocus('lastName')}
                      onBlur={() => handleBlur('lastName')}
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
                    )}
                  </div>
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
                    Complete Address *
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                      fieldErrors.address 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                    }`}
                    onFocus={() => handleFocus('address')}
                    onBlur={() => handleBlur('address')}
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.address && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>
                  )}
                </div>
                
                {/* Mobile & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label 
                      htmlFor="mobile" 
                      className={`absolute left-3 transition-all duration-200 ${
                        fieldFocused.mobile || formData.mobile 
                          ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2'
                          : 'top-1/2 text-gray-500 -translate-y-1/2'
                      }`}
                    >
                      Mobile Number *
                    </label>
                    <input
                      id="mobile"
                      type="tel"
                      name="mobile"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                        fieldErrors.mobile 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                      }`}
                      onFocus={() => handleFocus('mobile')}
                      onBlur={() => handleBlur('mobile')}
                      value={formData.mobile}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.mobile && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.mobile}</p>
                    )}
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
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                        fieldErrors.email 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                      }`}
                      onFocus={() => handleFocus('email')}
                      onBlur={() => handleBlur('email')}
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>
                
                {/* Graduation & CGPA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label 
                      htmlFor="graduation" 
                      className={`absolute left-3 transition-all duration-200 ${
                        fieldFocused.graduation || formData.graduation 
                          ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2'
                          : 'top-1/2 text-gray-500 -translate-y-1/2'
                      }`}
                    >
                      Graduation Degree *
                    </label>
                    <input
                      id="graduation"
                      type="text"
                      name="graduation"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                        fieldErrors.graduation 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                      }`}
                      onFocus={() => handleFocus('graduation')}
                      onBlur={() => handleBlur('graduation')}
                      value={formData.graduation}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.graduation && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.graduation}</p>
                    )}
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
                      CGPA (0-10) *
                    </label>
                    <input
                      id="cgpa"
                      type="number"
                      name="cgpa"
                      step="0.01"
                      min="0"
                      max="10"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                        fieldErrors.cgpa 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                      }`}
                      onFocus={() => handleFocus('cgpa')}
                      onBlur={() => handleBlur('cgpa')}
                      value={formData.cgpa}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.cgpa && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.cgpa}</p>
                    )}
                  </div>
                </div>
                
                {/* Job Position */}
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Desired Position *
                  </label>
                  <select
                    id="position"
                    name="position"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                      fieldErrors.position 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                    }`}
                    value={formData.position}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="" className="text-gray-400">Select a position</option>
                    <option value="Electric Engineer">Electric Engineer</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="EV Designer Engineer">EV Designer Engineer</option>
                    <option value="Data Analyst">Data Analyst</option>
                  </select>
                  {fieldErrors.position && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.position}</p>
                  )}
                </div>
                
                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume (PDF, DOC, DOCX) *
                  </label>
                  <div className="flex items-center">
                    <label className={`flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed cursor-pointer w-full ${
                      fieldErrors.resume ? 'border-red-500' : 'border-gray-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
                      <FaUpload className={`text-2xl mb-2 ${fieldErrors.resume ? 'text-red-500' : 'text-gray-500'}`} />
                      <span className={`text-sm ${fieldErrors.resume ? 'text-red-500' : 'text-gray-600'}`}>
                        {formData.resume ? formData.resume.name : 'Click to choose resume file'}
                      </span>
                      <input 
                        type="file" 
                        name="resume"
                        className="hidden"
                        onChange={handleChange}
                        accept=".pdf,.doc,.docx"
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>
                  {fieldErrors.resume && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.resume}</p>
                  )}
                  {formData.resume && !fieldErrors.resume && (
                    <p className="text-green-600 text-xs mt-1">✓ Resume selected: {formData.resume.name}</p>
                  )}
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="button"
                disabled={!isFormValid() || isSubmitting}
                onClick={handleSubmit}
                className={`w-full py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors mt-6 ${
                  isFormValid() && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 transition-all duration-200' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Application'
                )}
              </button>
              
              {/* Debug info (you can remove this in production) */}
              <div className="mt-2 text-xs text-gray-500 text-center">
                Form Status: {isFormValid() ? '✅ Ready to Submit' : '❌ Please fill all fields correctly'}
              </div>
              
              {/* Required fields note */}
              <p className="text-xs text-gray-500 mt-3 text-center">
                * All fields are required
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationFormModal;