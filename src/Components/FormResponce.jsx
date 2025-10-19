import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const FormResponse = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const homeLinkRef = useRef(null); // Renamed for clarity

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
      // Programmatically click the home link
      if (homeLinkRef.current) {
        homeLinkRef.current.click();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
                if (onClose) onClose();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default FormResponse;