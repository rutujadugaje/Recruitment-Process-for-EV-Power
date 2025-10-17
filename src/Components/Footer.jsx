import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1e293b] text-gray-300 w-full mt-12">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-extrabold text-white mb-4">EV POWER</h3>
            <p className="text-gray-400 leading-relaxed">
              Empowering the future with clean energy solutions and sustainable transportation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-yellow-400 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/join-us" className="hover:text-yellow-400 transition-colors">Join Us</Link>
              </li>
            </ul>
          </div>

          {/* Careers */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Careers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-yellow-400 transition-colors">Job Openings</Link>
              </li>
              <li>
                <Link to="/emp-benefits" className="hover:text-yellow-400 transition-colors">Employee Benefits</Link>
              </li>
              <li>
                <Link to="/join-us" className="hover:text-yellow-400 transition-colors">Apply Now</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <address className="not-italic space-y-1 text-gray-400">
              <p className="hover:text-yellow-400">123 Energy Street</p>
              <p className="hover:text-yellow-400">San Francisco, CA 94107</p>
              <p className="mt-2 hover:text-yellow-400">Email: info@evpower.com</p>
              <p className="hover:text-yellow-400">Phone: (+91) 456-7890579</p>
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 mt-6"></div>

        {/* Bottom Info */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} <span className="text-white font-bold">EV POWER</span>. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <Link to="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-yellow-400 transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-yellow-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
