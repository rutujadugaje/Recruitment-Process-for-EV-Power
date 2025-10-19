import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function SignIn() {
  const [role, setRole] = useState('HR');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPage, setShowPage] = useState(false); // for page fade-in

  const handleSignIn = (e) => {
    e.preventDefault();
    console.log(`Signing in as ${role} with`, { email, password });
  };

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setShowPage(true), 100);
  }, []);

  return (
    <div
      className={`h-screen flex flex-col items-center justify-center bg-gray-100 transition-opacity duration-700 ${
        showPage ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h2 className="text-2xl mb-4 transform transition duration-700 ease-out translate-y-0">
        Sign In as {role}
      </h2>

      <div className="mb-4 flex transition-all duration-500 ease-in-out scale-100">
        <button
          onClick={() => setRole('HR')}
          className={`px-4 py-2 mr-2 rounded text-white transition-all duration-300 ${
            role === 'HR' ? 'bg-blue-700' : 'bg-blue-500'
          }`}
        >
          HR
        </button>
        <button
          onClick={() => setRole('Admin')}
          className={`px-4 py-2 rounded text-white transition-all duration-300 ${
            role === 'Admin' ? 'bg-green-700' : 'bg-green-500'
          }`}
        >
          Admin
        </button>
      </div>

      <form
        onSubmit={handleSignIn}
        className="bg-white p-6 rounded shadow-md h-[300px] w-[400px] flex flex-col items-center justify-center transform transition-all duration-700 scale-100"
      >
        <input
          type="email"
          placeholder="Email"
          className="block mb-4 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="block mb-4 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 active:scale-95 transition-all duration-200"
        >
          Sign In
        </button>
      </form>

      <p className="mt-4 text-gray-700 transition-opacity duration-1000 delay-500 opacity-100">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default SignIn;
