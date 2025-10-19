import React from 'react';
import Layout from './Components/Layout';
import HomeSection from './Components/HomeSection';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import OnlineTest from './Components/OnlineTest';
import About from './Components/About';
import EmployeeBenefits from './Components/EmployeeBenefits';
import FormResponce from './Components/FormResponce';
import Footer from './Components/Footer';
import JobPositions from './Components/JobPositions';
import ExperienceForm from './Components/ExperienceForm';
import AptitudeLogin from './Components/AptitudeLogin';
import Results from './Components/Results';
import UserTestsTable from './Components/UserTestsTable';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import InterviewTest from './Components/InterviewTest';
import JobDetails from './Components/JobDetails';
import HRDashboard from './Components/HRDashboard'
import AdminDasboard from './Components/AdminDashboard'
import AdminDashboard from './Components/AdminDashboard';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Layout />
        <Routes>
          <Route exact path="/" element={<HomeSection />} />
          <Route exact path="/onlinetest" element={<OnlineTest />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/emp-benefits" element={<EmployeeBenefits />} />
          <Route exact path="/form-respones" element={<FormResponce />} />
          <Route exact path="/job-positions" element={<JobPositions />} />
          <Route path="/experience-form/:title/:details/:location" element={<ExperienceForm />} />
          <Route path="/user-aptitude-login" element={<AptitudeLogin />} />
          <Route path="/test-history" element={<UserTestsTable />} />
          <Route path="/results" element={<Results />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route exact path="/interviewtest" element={<InterviewTest />} />
          <Route exact path="/job-details" element={<JobDetails />} />
          <Route exact path="/hr-dashboard" element={<HRDashboard />} />
          <Route exact path="/admindashboard" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;

