import { useEffect, useState } from 'react';
// Removed useParams as initial data will come from props for a modal
// import { useParams } from 'react-router-dom';

const ExperienceForm = ({
  isOpen,
  onClose,
  initialTitle = '',
  initialDetails = '',
  initialLocation = ''
}) => {
  // State for all submitted experiences, loaded from localStorage
  const [allStoredExperiences, setAllStoredExperiences] = useState([]);

  // Load saved data from localStorage on component mount or when modal opens
  useEffect(() => {
    if (isOpen) { // Load data when modal becomes visible
      const storedExperienceData = localStorage.getItem('experienceFormData');
      if (storedExperienceData) {
        try {
          const parsedData = JSON.parse(storedExperienceData);
          setAllStoredExperiences(parsedData);
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
          setAllStoredExperiences([]); // Reset to empty array on error
        }
      } else {
        setAllStoredExperiences([]); // No data in local storage
      }
    }
  }, [isOpen]); // Rerun when isOpen changes

  // State for the current form's data including possibly multiple experience entries
  const [currentFormData, setCurrentFormData] = useState({
    experiences: [{
      location: initialLocation || '',
      position: initialTitle || '',
      companyName: '',
      durationFrom: '',
      durationTo: '',
      workModule: '',
      firstName: '',
      lastName: '',
      address: '',
      mobile: '',
      email: '',
      oldposition: '', // This was 'position' in the input, assuming it's for the specific experience
      experienceFile: null,
      experiance: initialDetails || '', // 'experiance' field from your original code for details
    }]
  });

  // Reset form when initial props change (e.g., opening modal for a different item)
  useEffect(() => {
    setCurrentFormData({
      experiences: [{
        location: initialLocation || '',
        position: initialTitle || '',
        companyName: '',
        durationFrom: '',
        durationTo: '',
        workModule: '',
        firstName: '',
        lastName: '',
        address: '',
        mobile: '',
        email: '',
        oldposition: '',
        experienceFile: null,
        experiance: initialDetails || '',
      }]
    });
    // Also reset focused fields when props change (new form instance)
    setFieldFocused({});
  }, [initialTitle, initialDetails, initialLocation, isOpen]); // Added isOpen to reset when re-opened

  const [fieldFocused, setFieldFocused] = useState({});

  const handleExperienceChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedExperiences = [...currentFormData.experiences];
    updatedExperiences[index][name] = files ? files[0] : value;
    setCurrentFormData(prev => ({
      ...prev,
      experiences: updatedExperiences
    }));
  };

  const handleExperienceFocus = (index, field) => {
    setFieldFocused(prev => ({
      ...prev,
      [`${field}${index}`]: true
    }));
  };

  const handleExperienceBlur = (index, field) => {
    if (!currentFormData.experiences[index][field]) {
      setFieldFocused(prev => ({
        ...prev,
        [`${field}${index}`]: false
      }));
    }
  };

  const removeExperience = (index) => {
    const updatedExperiences = currentFormData.experiences.filter((_, i) => i !== index);
    setCurrentFormData(prev => ({
      ...prev,
      experiences: updatedExperiences
    }));
  };

  const isFormValid = currentFormData.experiences.every(i =>
    i.firstName && i.lastName && i.mobile && i.email && i.durationFrom && i.durationTo && i.workModule && i.experienceFile
  );

  const handleSubmit = () => {
    // The currentFormData contains the new application being submitted
    // allStoredExperiences contains applications previously stored.
    const newDataToStore = [...allStoredExperiences, currentFormData]; // Add current form as a new entry
    localStorage.setItem('experienceFormData', JSON.stringify(newDataToStore));
    setAllStoredExperiences(newDataToStore); // Update the state reflecting all data

    console.log('Form submitted:', currentFormData);
    console.log('All saved experiences in localStorage:', newDataToStore);
    onClose(); // Close the modal after submission
    // Optionally reset form fields here if the modal might be reopened for a fresh entry without prop changes
    // However, the useEffect for prop changes already handles reset.
  };

  if (!isOpen) {
    return null; // Don't render anything if the modal is not open
  }

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Application Form</h1>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl"
            aria-label="Close modal"
          >
            &times; {/* Close button (X) */}
          </button>
        </div>

        {/* Form content starts here, using currentFormData */}
        {currentFormData.experiences.map((experienceItem, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg relative">
            {/* The 'Remove Experience' button was designed for multiple experience sections within one form submission.
                If each modal submission is for ONE main experience (potentially with multiple past roles within that person's single application),
                then an "Add another past role" might be more appropriate than "Remove Experience" unless you intend for a single application to clear out.
                For now, keeping the logic as is: if 'experiences' array can grow, this remove button is relevant.
                If 'experiences' array is always one item per submission, this button is not needed.
                Assuming currentFormData.experiences can have multiple items (e.g. "Add another role for this application").
            */}
            {currentFormData.experiences.length > 1 && ( // Only show remove if more than one experience block
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs p-1 bg-red-100 rounded"
              >
                Remove Role
              </button>
            )}

            {/* Personal Information */}
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Applicant Details {currentFormData.experiences.length > 1 ? `(Role ${index + 1})` : ''}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* First name */}
              <div className="relative">
                <label
                  htmlFor={`firstName-${index}`}
                  className={`absolute left-3 transition-all duration-200 ${fieldFocused[`firstName${index}`] || experienceItem.firstName ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2' : 'top-1/2 text-gray-500 -translate-y-1/2'}`}
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id={`firstName-${index}`}
                  type="text"
                  name="firstName"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onFocus={() => handleExperienceFocus(index, 'firstName')}
                  onBlur={() => handleExperienceBlur(index, 'firstName')}
                  value={experienceItem.firstName}
                  onChange={(e) => handleExperienceChange(index, e)}
                />
              </div>

              {/* Last name */}
              <div className="relative">
                <label
                  htmlFor={`lastName-${index}`}
                  className={`absolute left-3 transition-all duration-200 ${fieldFocused[`lastName${index}`] || experienceItem.lastName ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2' : 'top-1/2 text-gray-500 -translate-y-1/2'}`}
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id={`lastName-${index}`}
                  type="text"
                  name="lastName"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onFocus={() => handleExperienceFocus(index, 'lastName')}
                  onBlur={() => handleExperienceBlur(index, 'lastName')}
                  value={experienceItem.lastName}
                  onChange={(e) => handleExperienceChange(index, e)}
                />
              </div>
            </div>

            {/* Address */}
            <div className="relative mb-6">
              <label
                htmlFor={`address-${index}`}
                className={`absolute left-3 transition-all duration-200 ${fieldFocused[`address${index}`] || experienceItem.address ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2' : 'top-1/2 text-gray-500 -translate-y-1/2'}`}
              >
                Address
              </label>
              <input
                id={`address-${index}`}
                type="text"
                name="address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onFocus={() => handleExperienceFocus(index, 'address')}
                onBlur={() => handleExperienceBlur(index, 'address')}
                value={experienceItem.address}
                onChange={(e) => handleExperienceChange(index, e)}
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Mobile Number */}
              <div className="relative">
                <label
                  htmlFor={`mobile-${index}`}
                  className={`absolute left-3 transition-all duration-200 ${fieldFocused[`mobile${index}`] || experienceItem.mobile ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2' : 'top-1/2 text-gray-500 -translate-y-1/2'}`}
                >
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  id={`mobile-${index}`}
                  type="tel"
                  name="mobile"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onFocus={() => handleExperienceFocus(index, 'mobile')}
                  onBlur={() => handleExperienceBlur(index, 'mobile')}
                  value={experienceItem.mobile}
                  onChange={(e) => handleExperienceChange(index, e)}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <label
                  htmlFor={`email-${index}`}
                  className={`absolute left-3 transition-all duration-200 ${fieldFocused[`email${index}`] || experienceItem.email ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2' : 'top-1/2 text-gray-500 -translate-y-1/2'}`}
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id={`email-${index}`}
                  type="email"
                  name="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onFocus={() => handleExperienceFocus(index, 'email')}
                  onBlur={() => handleExperienceBlur(index, 'email')}
                  value={experienceItem.email}
                  onChange={(e) => handleExperienceChange(index, e)}
                />
              </div>
            </div>
             <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Applying For</h2>
            {/* Position from initial props (disabled) */}
            <div className="relative mb-4">
              <label htmlFor={`position-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Job Position
              </label>
              <input
                disabled
                id={`position-${index}`}
                type="text"
                name="position"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                value={experienceItem.position} // This comes from initialTitle prop
              />
            </div>

            {/* Location from initial props (disabled) */}
            <div className="relative mb-4">
              <label htmlFor={`location-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                disabled
                id={`location-${index}`}
                type="text"
                name="location"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                value={experienceItem.location} // This comes from initialLocation prop
              />
            </div>

            {/* Experience (details) from initial props (disabled) */}
            <div className="relative mb-4">
              <label htmlFor={`experiance-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Required Experience/Details
              </label>
              <textarea
                disabled
                id={`experiance-${index}`}
                name="experiance"
                rows="2"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                value={experienceItem.experiance} // This comes from initialDetails prop
              />
            </div>

            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Work Experience</h2>
            {/* Company Name */}
            <div className="relative mb-4">
              <label
                htmlFor={`companyName-${index}`}
                className={`absolute left-3 transition-all duration-200 ${fieldFocused[`companyName${index}`] || experienceItem.companyName ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2' : 'top-1/2 text-gray-500 -translate-y-1/2'}`}
              >
                Company Name
              </label>
              <input
                id={`companyName-${index}`}
                type="text"
                name="companyName"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onFocus={() => handleExperienceFocus(index, 'companyName')}
                onBlur={() => handleExperienceBlur(index, 'companyName')}
                value={experienceItem.companyName}
                onChange={(e) => handleExperienceChange(index, e)}
              />
            </div>

            {/* Previous Position */}
            <div className="relative mb-4">
              <label
                htmlFor={`oldposition-${index}`}
                className={`absolute left-3 transition-all duration-200 ${fieldFocused[`oldposition${index}`] || experienceItem.oldposition ? 'top-0 text-xs bg-white px-1 text-blue-500 -translate-y-1/2' : 'top-1/2 text-gray-500 -translate-y-1/2'}`}
              >
                Position Held
              </label>
              <input
                id={`oldposition-${index}`}
                type="text"
                name="oldposition"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onFocus={() => handleExperienceFocus(index, 'oldposition')}
                onBlur={() => handleExperienceBlur(index, 'oldposition')}
                value={experienceItem.oldposition}
                onChange={(e) => handleExperienceChange(index, e)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Duration From */}
              <div>
                <label htmlFor={`durationFrom-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Duration From <span className="text-red-500">*</span>
                </label>
                <input
                  id={`durationFrom-${index}`}
                  type="date"
                  name="durationFrom"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={experienceItem.durationFrom}
                  onChange={(e) => handleExperienceChange(index, e)}
                />
              </div>

              {/* Duration To */}
              <div>
                <label htmlFor={`durationTo-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Duration To <span className="text-red-500">*</span>
                </label>
                <input
                  id={`durationTo-${index}`}
                  type="date"
                  name="durationTo"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={experienceItem.durationTo}
                  onChange={(e) => handleExperienceChange(index, e)}
                />
              </div>
            </div>

            {/* Work Module */}
            <div className="mb-4">
              <label htmlFor={`workModule-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Work Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id={`workModule-${index}`}
                name="workModule"
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={experienceItem.workModule}
                onChange={(e) => handleExperienceChange(index, e)}
                placeholder="Describe your work responsibilities and achievements"
              />
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label htmlFor={`experienceFile-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Upload Experience Document (CV/Letter) <span className="text-red-500">*</span>
              </label>
              <input
                id={`experienceFile-${index}`}
                type="file"
                name="experienceFile"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => handleExperienceChange(index, e)}
                accept=".pdf,.doc,.docx"
              />
              {experienceItem.experienceFile && <span className="text-sm text-gray-600 mt-2 block">Selected: {experienceItem.experienceFile.name}</span>}
            </div>
          </div>
        ))}
        
        {/* Add Experience Button - if you intend for a single application form to contain multiple distinct roles/experiences */}
        {/* For simplicity, this example assumes one main experience entry per modal submission, but you can re-enable this if needed */}
        {/*
        <button
          type="button"
          onClick={addExperience} // You would need to define addExperience function
          className="text-blue-600 hover:text-blue-800 mb-6"
        >
          + Add Another Experience/Role
        </button>
        */}

        {/* Submit Button */}
        <button
          type="button" // Changed from submit to button as we handle submit via onClick
          disabled={!isFormValid}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${isFormValid ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default ExperienceForm;