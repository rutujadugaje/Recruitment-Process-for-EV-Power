import React, { useState } from "react";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobPositions = () => {
  const navigate = useNavigate();

  const allJobs = [
    {
      img: "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg",
      title: "Software Engineer",
      details: "Experience: 2+ Years",
      location: "Pune",
      description: "Responsible for designing, developing, testing, and maintaining software applications.",
    },
    {
      img: "https://images.pexels.com/photos/9243229/pexels-photo-9243229.jpeg",
      title: "Battery Technician",
      details: "Experience: 1+ Years",
      location: "Chennai",
      description: "Responsible for assembling, testing, and maintaining battery systems.",
    },
    {
      img: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg",
      title: "HR Manager",
      details: "Experience: 3+ Years",
      location: "Mumbai",
      description: "Manage recruitment, employee relations, and performance management.",
    },
    {
      img: "https://images.pexels.com/photos/5292195/pexels-photo-5292195.jpeg",
      title: "Battery Design Engineer",
      details: "Experience: 3+ Years",
      location: "Bengaluru",
      description: "Design and prototype lithium-ion battery packs and modules.",
    },
    {
      img: "https://images.pexels.com/photos/5716001/pexels-photo-5716001.jpeg",
      title: "Marketing Specialist",
      details: "Experience: 2+ Years",
      location: "Banglore",
      description: "Develop and execute marketing strategies to promote products.",
    },
    {
      img: "https://images.pexels.com/photos/9242289/pexels-photo-9242289.jpeg",
      title: "Electrical Engineer",
      details: "Experience: 3+ Years",
      location: "Pune",
      description: "Design and test electrical systems and components.",
    },
    {
      img: "https://images.pexels.com/photos/7682340/pexels-photo-7682340.jpeg",
      title: "Customer Support",
      details: "Experience: 1+ Years",
      location: "Nashik",
      description: "Support customers via phone, email, and chat.",
    },
    {
      img: "https://images.pexels.com/photos/8463145/pexels-photo-8463145.jpeg",
      title: "Sales Executive",
      details: "Experience: 2+ Years",
      location: "Nashik",
      description: "Sell products and services to customers.",
    },
    {
      img: "https://images.pexels.com/photos/19226354/pexels-photo-19226354.jpeg",
      title: "BMS Engineer",
      details: "Experience: 2+ Years",
      location: "Pune",
      description: "Maintain battery monitoring systems and safety firmware.",
    },
    {
      img: "https://images.pexels.com/photos/3862630/pexels-photo-3862630.jpeg",
      title: "Thermal Systems Engineer",
      details: "Experience: 2+ Years",
      location: "Chennai",
      description: "Design thermal management systems for EV batteries.",
    },
    {
      img: "https://images.pexels.com/photos/8940473/pexels-photo-8940473.jpeg",
      title: "Battery Research Scientist",
      details: "Experience: 2+ Years",
      location: "Hyderabad",
      description: "Research next-gen battery chemistries and density.",
    },
    {
      img: "https://images.pexels.com/photos/19895881/pexels-photo-19895881.jpeg",
      title: "QA Engineer",
      details: "Experience: 2+ Years",
      location: "Delhi",
      description: "Perform QA checks and resolve battery production defects.",
    },
  ];

  const [showAllJobs, setShowAllJobs] = useState(false);

  const toggleJobs = () => {
    setShowAllJobs((prev) => !prev);
  };

  const handleReadMore = (job) => {
    navigate("/job-details", { state: job });
  };

  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Current Job Positions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(showAllJobs ? allJobs : allJobs.slice(0, 4)).map((job, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg shadow hover:shadow-lg transition duration-300 p-4 flex flex-col justify-between h-[280px]"
            >
              <img
                src={job.img}
                alt={job.title}
                className="h-28 w-full object-cover rounded mb-3"
              />

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase size={18} className="text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                </div>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{job.details}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleReadMore(job)}
                className="text-sm text-blue-600 mt-3 hover:underline"
              >
                View Job...
              </button>
            </div>
          ))}
        </div>

        {allJobs.length > 4 && (
          <div className="text-center mt-8">
            <button
              onClick={toggleJobs}
              className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
            >
              {showAllJobs ? "Show Less" : "View More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobPositions;
