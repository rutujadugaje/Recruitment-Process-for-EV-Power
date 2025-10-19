import React, { useEffect, useState } from 'react';
import img from '../assets/slderimg.png';
import { Link } from 'react-router-dom';
import ApplicationFormModal from './ApplicationFormModal';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [modal, setModal] = useState(false)
  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-200 to-white flex items-center justify-center sm:px-6 px-6 py-12 overflow-hidden ">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>

      {/* Content Container */}
      <div className="container relative  z-10 mx-auto flex flex-col-reverse md:flex-row-reverse items-center gap-12 md:gap-0 md:mb-24 bg-green-50 rounded-lg shadow-lg p-8 md:p-16 sm:p-8  ">

        {/* Image Section */}
        <div
          className={`md:w-1/2 w-full mt-12 md:mt-0 flex justify-center transition-opacity duration-1000 ease-out `}
        >
          <img
            src={img}
            alt="Recruitment"
            className="md:mr-32 mr-0 "
          />
        </div>

        {/* Text Section */}
        <div
          className={`md:w-1/2 w-full flex flex-col items-center justify-center text-center  md:text-left md:mt-10 p-8 space-y-6 transition-opacity duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 ">
            Join the Future of
            <span className="text-blue-900 block">EV Battery Innovation</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-md">
            Your journey to a <span className="font-medium text-blue-700">sustainable career</span> starts here!
          </p>
          <p className='text-center opacity-70'>We are committed to shaping the future of clean energy through innovation and excellence.  
            Collaborate with industry leaders, grow your skills, and contribute to impactful projects that drive change worldwide.</p>
          <Link
            onClick={()=>setModal(true)}
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold text-lg rounded-full shadow-lg hover:from-blue-500 hover:to-blue-600 transform transition-all duration-300 hover:scale-110 hover:shadow-2xl "
          >
            🚀 Apply Now
          </Link>
        </div>
      </div>
<ApplicationFormModal isOpen={modal} onClose={() => setModal(false)} />
    </div>

        
          
  );
};

export default HeroSection;
