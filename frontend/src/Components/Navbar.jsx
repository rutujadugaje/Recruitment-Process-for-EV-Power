import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import ApplicationFormModal from "./ApplicationFormModal";
import Login from "./Login";

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolling ? "bg-navy backdrop-blur-md shadow-lg py-3" : "bg-navy py-4"
        } text-white`}
      >
        <div className="flex justify-between items-center px-6">
          {/* Logo */}
          <div
            className={`font-extrabold transition-all duration-300 ${
              scrolling ? "text-xl" : "text-2xl"
            }`}
          >
            <Link to="/">EV POWER</Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 text-base font-semibold">
            <li><Link to="/" className="hover:text-blue-200">Home</Link></li>
            <li><Link to="/about" className="hover:text-blue-200">About</Link></li>
            <li><Link to="/emp-benefits" className="hover:text-blue-200">Employee Benefits</Link></li>
          </ul>

          {/* Buttons */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => setIsJoinModalOpen(true)}
             className="hidden md:block bg-gradient-to-r from-blue-300 to-blue-400 text-navy font-bold px-4 py-2 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-600 transform transition-all duration-300 hover:scale-105"
            >
              Join Us
            </button>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="hidden md:block bg-gradient-to-r from-blue-300 to-blue-400 text-navy font-bold px-4 py-2 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-600 transform transition-all duration-300 hover:scale-105"
            >
              Login
            </button>
          </div>


          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="text-xl font-extrabold text-blue-700">EV POWER</div>
              <button className="text-gray-500" onClick={closeMobileMenu}>
                <X size={24} />
              </button>
            </div>

            <ul className="flex flex-col gap-6 text-lg font-semibold text-[#413c69]">
              <li>
                <Link to="/" onClick={closeMobileMenu} className="hover:text-blue-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={closeMobileMenu} className="hover:text-blue-500">
                  About
                </Link>
              </li>
              <li>
                <Link to="/emp-benefits" onClick={closeMobileMenu} className="hover:text-blue-500">
                  Employee Benefits
                </Link>
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsJoinModalOpen(true);
                  closeMobileMenu();
                }}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
              >
                Join Us
              </button>
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  closeMobileMenu();
                }}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ApplicationFormModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
      <Login isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );

  
};

export default Navbar;
