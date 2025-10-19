import React from "react";
import img from '../assets/EVPOWER.jpeg'
import { FileText, BrainCircuit, MessagesSquare, Handshake } from 'lucide-react';

const About = () => {
    return (
        <div className="">
            <div className="bg-gradient-to-b from-blue-100 to-white container py-12 mx-auto px-6 md:mt-14 lg:px-20">

                {/* Hero Section */}
                <section className="text-center mb-12 animate-fade-in">
                    <h1 className="text-5xl font-bold text-blue-900 mb-4">
                        About Our Hiring Process
                    </h1>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                        Join us and be part of our mission to create a positive impact through innovative solutions.
                    </p>
                    <button className="mt-6 bg-gradient-to-r from-blue-400 to-blue-500 text-white px-6 py-3 rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:scale-105">
                        Explore Opportunities
                    </button>
                </section>

                {/* Company Overview */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-24 animate-slide-up">
                    <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-2xl transition-all duration-300 md:p-32">
                        <h2 className="text-3xl font-bold text-blue-900 mb-4 ">Who We Are</h2>
                        <p className="text-gray-700 leading-relaxed ">
                            We are a leading tech company focused on innovation and excellence. Our vision is to create a dynamic work environment where individuals can grow and thrive.
                            We don't just follow trends—we set them, delivering impactful solutions that make a difference.
                            Integrity, agility, and forward-thinking define how we operate and succeed in a competitive world.
                        </p>
                    </div>
                    <img
                        src={img}
                        alt="Company"
                        className="w-full h-[500px] rounded-lg shadow-lg object-cover animate-fade-in"
                    />
                </section>

                {/* Why Join Us */}
                <section className="mb-24 animate-slide-right">
                    <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">Why Join Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Growth Opportunities", desc: "Unlock your potential and achieve career growth." },
                            { title: "Collaborative Environment", desc: "Be part of an inclusive and dynamic team." },
                            { title: "Work-Life Balance", desc: "Maintain a healthy balance between work and life." },
                        ].map((item, index) => (
                            <div key={index} className="p-6 bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300">
                                <h3 className="text-xl font-bold text-blue-800 mb-2">{item.title}</h3>
                                <p className="text-gray-700">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Hiring Process */}
                <section className="mb-24 animate-fade-in">
                    <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">Our Hiring Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { title: "Online Application", icon: <FileText className="w-10 h-10 mx-auto mb-3 text-blue-600" /> },
                            { title: "Aptitude Test", icon: <BrainCircuit className="w-10 h-10 mx-auto mb-3 text-blue-700" /> },
                            { title: "Technical/HR Interview", icon: <MessagesSquare className="w-10 h-10 mx-auto mb-3 text-blue-800" /> },
                            { title: "Onboarding/Joining", icon: <Handshake className="w-10 h-10 mx-auto mb-3 text-blue-900" /> },
                        ].map((step, index) => (
                            <div key={index} className="p-6 bg-white rounded-lg shadow-md hover:scale-105 transition-all duration-300 text-center">
                                {step.icon}
                                <h3 className="text-xl font-bold mb-2 text-gray-800">Step {index + 1}</h3>
                                <p className="text-gray-600">{step.title}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Meet the Team */}
                <section className="mb-24 animate-slide-left">
                    <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">Meet Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
                        {[
                            { name: "Anisha Shah", role: "CEO", image: "https://img.freepik.com/free-photo/happy-caucasian-woman-shaking-hands-with-latin-man-business-meeting-with-lawyer-manager-hiring-beautiful-professional-woman-new-job_662251-184.jpg?uid=R193170762&ga=GA1.1.1295805920.1738597017&semt=ais_hybrid&w=740" },
                            { name: "Maya Kapoor", role: "CTO", image: "https://img.freepik.com/free-photo/medium-shot-woman-working-laptop_23-2149300643.jpg?uid=R193170762&ga=GA1.1.1295805920.1738597017&semt=ais_hybrid&w=740" },
                            { name: "Harikumar Nair", role: "HR Manager", image: "https://img.freepik.com/free-photo/manager-listening-caucasian-candidate_482257-120886.jpg?uid=R193170762&ga=GA1.1.1295805920.1738597017&semt=ais_hybrid&w=740" },
                        ].map((member, index) => (
                            <div key={index} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center border border-gray-100">
                                <div className="mb-4">
                                    <img src={member.image} className="w-42 h-42 rounded-full mx-auto object-cove border border-blue-100" alt=""/>
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                                    <p className="text-blue-700 font-medium">{member.role}</p>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

              
            </div>
        </div>
    );
};

export default About;
