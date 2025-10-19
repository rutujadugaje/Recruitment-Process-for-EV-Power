import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExperienceForm from './ExperienceForm';

const JobDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  if (!state) {
    return (
      <div className="text-center mt-20 text-red-500">
        No job data found. Please go back and select a job.
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { img, title, details, location, description } = state;

  const handleApply = () => {
    setIsJoinModalOpen(true);
  };

  return (
    <>
      <section className="py-16 bg-gray-50 text-gray-900 mt-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {img && (
              <img
                src={img}
                alt={title}
                className="w-full h-64 object-cover rounded mb-6"
              />
            )}
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600 mb-2">{details}</p>
            <p className="text-gray-600 mb-4">Location: {location}</p>
            <p className="text-gray-800 mb-6">{description}</p>

            <button
              onClick={handleApply}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Apply Now
            </button>
          </div>
        </div>
      </section>

      <ExperienceForm 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)}
        jobPosition={title}
        location={location}
        experience={details}
      />
    </>
  );
};

export default JobDetails;