import React, { useState, useEffect, useRef } from 'react';

const InterviewTest = () => {
  const [username, setUsername] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(1); // Start with 1 (the current user)
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isMeetingStarted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            // Optionally, automatically end meeting or notify
            console.log('Time is up! Meeting ended.');
            setIsMeetingStarted(false); // End meeting if time runs out
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isMeetingStarted]);

  useEffect(() => {
    const setupCamera = async () => {
      if (isCameraOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error('Error accessing camera:', err);
          setIsCameraOn(false); // Turn off the toggle if access fails
          alert('Could not access your camera. Please check permissions.');
        }
      } else {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop()); // Stop all tracks
          videoRef.current.srcObject = null;
        }
      }
    };

    setupCamera();
  }, [isCameraOn]);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleStartMeeting = () => {
    if (username.trim() === '') {
      alert('Please enter your username to start the meeting.');
      return;
    }
    setIsMeetingStarted(true);
    // In a real application, you would connect to your WebRTC/backend here
    console.log('Meeting started for:', username);
    console.log('Camera:', isCameraOn ? 'On' : 'Off');
    console.log('Mic:', isMicOn ? 'On' : 'Off');
    // Simulate other participants joining (for UI demo purposes)
    // In a real app, this would be managed by the backend
    setTimeout(() => setParticipantsCount(prev => prev + 1), 5000); // Simulate one joining
    setTimeout(() => setParticipantsCount(prev => prev + 1), 10000); // Simulate another joining
  };

  const handleEndMeeting = () => {
    const confirmEnd = window.confirm('Are you sure you want to end the meeting?');
    if (confirmEnd) {
      setIsMeetingStarted(false);
      setTimeLeft(3600); // Reset timer
      setUsername(''); // Clear username
      setIsCameraOn(false); // Turn off camera
      setIsMicOn(false); // Turn off mic
      setParticipantsCount(1); // Reset participants
      // In a real application, disconnect from WebRTC/backend here
      console.log('Meeting ended.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Online Interview Test</h1>

        {!isMeetingStarted ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Your Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your name"
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="cameraToggle" className="text-sm font-medium text-gray-700">
                Camera:
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="cameraToggle"
                  checked={isCameraOn}
                  onChange={() => setIsCameraOn(!isCameraOn)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {isCameraOn ? 'On' : 'Off'}
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="micToggle" className="text-sm font-medium text-gray-700">
                Microphone:
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="micToggle"
                  checked={isMicOn}
                  onChange={() => setIsMicOn(!isMicOn)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {isMicOn ? 'On' : 'Off'}
                </span>
              </label>
            </div>

            <button
              onClick={handleStartMeeting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Start Interview
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-800">
                Welcome, <span className="text-blue-600">{username}</span>!
              </p>
              <p className="text-lg text-gray-600">
                Time Remaining: <span className="font-bold text-red-600">{formatTime(timeLeft)}</span>
              </p>
              <p className="text-md text-gray-600">
                Participants: <span className="font-bold text-green-600">{participantsCount}</span>
              </p>
            </div>

            <div className="relative bg-gray-800 rounded-lg overflow-hidden h-64 w-full">
              {isCameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="object-cover w-full h-full"
                ></video>
              ) : (
                <div className="flex items-center justify-center h-full text-white text-lg">
                  Camera is Off
                </div>
              )}
              <div className="absolute top-2 left-2 p-1 bg-gray-900 bg-opacity-75 rounded-md text-white text-xs">
                {isCameraOn ? 'Camera ON' : 'Camera OFF'}
              </div>
            </div>

            <div className="flex justify-around items-center">
              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`p-3 rounded-full ${
                  isCameraOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'
                } text-white transition duration-200`}
                title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
              >
                {/* Simple SVG Icons (replace with actual icon library like Heroicons for production) */}
                {isCameraOn ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.87-4.87A2 2 0 0122 6.5v11a2 2 0 01-3.13 1.63L15 14m-3 0h-2a2 2 0 01-2-2V8a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.87-4.87A2 2 0 0122 6.5v11a2 2 0 01-3.13 1.63L15 14m-3 0h-2a2 2 0 01-2-2V8a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2zM6 18L18 6"
                    />
                  </svg>
                )}
              </button>

              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-full ${
                  isMicOn ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
                } text-white transition duration-200`}
                title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {/* Simple SVG Icons */}
                {isMicOn ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-14 0v-2a7 7 0 0114 0v2zM12 20v-4m0 0H8m4 0h4"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-14 0v-2a7 7 0 0114 0v2zM12 20v-4m0 0H8m4 0h4M19 10l-2-2m-3-3l-2-2M5 10l2-2"
                    />
                  </svg>
                )}
              </button>

              <button
                onClick={handleEndMeeting}
                className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 flex items-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H5a3 3 0 01-3-3v-10a3 3 0 013-3h5a3 3 0 013 3v1"
                  />
                </svg>
                <span>End Meeting</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewTest;