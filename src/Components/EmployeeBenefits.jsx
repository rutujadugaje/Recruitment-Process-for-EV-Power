import React from 'react';
import clsx from 'clsx';
const EmployeeBenefits = () => {
  const employees = [
    {
      id: 1,
      name: 'Anurag Patel',
      role: 'Senior Engineer',
      testimonial: 'The health benefits at EV Power I are truly comprehensive. I\'ve never felt so supported by a company before.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Product Manager',
      testimonial: 'The flexible work policy allows me to balance my family needs with my career ambitions perfectly.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 3,
      name: 'Rajesh Kumar',
      role: 'Marketing Director',
      testimonial: 'The professional development budget helped me earn two certifications this year that advanced my career.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
    }
  ];

  const benefits = [
    {
      id: 1,
      title: 'Health & Wellness',
      color: 'blue-500',
      bordercolor : 'border-blue-500',
      bgcolor : 'bg-blue-500',
      items: [
        'Comprehensive medical, dental, and vision plans',
        'Mental health counseling services',
        '$500 annual fitness reimbursement'
      ]
    },
    {
      id: 2,
      title: 'Financial Benefits',
      color: 'emerald-500',
      bordercolor : 'border-emerald-500',
      bgcolor : 'bg-emerald-500',
      items: [
        'Competitive salary with annual reviews',
        '401(k) with 5% company match',
        'Annual performance bonuses',
        'Stock options for all employees'
      ]
    },
    {
      id: 3,
      title: 'Work-Life Balance',
      color: 'purple-500',
      bordercolor : 'border-purple-500',
      bgcolor : 'bg-purple-500',
      items: [
        'Flexible hours and remote work options',
        '20 days PTO + 10 holidays + your birthday',
        '12 weeks paid parental leave',
        '4-week paid sabbatical every 5 years'
      ]
    },
    {
      id: 4,
      title: 'Learning & Development',
      color: 'yellow-500',
      bordercolor : 'border-yellow-500',
      bgcolor : 'bg-yellow-500',
      items: [
        '$5,000 annual tuition reimbursement',
        'Conference and training budget',
        'Internal mentorship program',
        'Weekly knowledge sharing sessions'
      ]
    },
    {
      id: 5,
      title: 'Perks & Extras',
      color: 'green-500',
      bordercolor : 'border-green-500',
      bgcolor : 'bg-green-500',
      items: [
        'Free EV charging at all company locations',
        'Company vehicle lease program',
        'Healthy meals and snacks',
        'Quarterly team outings and events'
      ]
    },
    {
      id: 6,
      title: 'EV-Specific Benefits',
      color: 'orange-500',
      bordercolor : 'border-orange-500',
      bgcolor : 'bg-orange-500',
      items: [
        'Employee discount on EV purchases',
        'Home charging station installation subsidy',
        'Access to latest EV models for testing',
        'Participation in industry conferences'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-blue-700">Employee Benefits</h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            We invest in our team’s health, happiness, and future.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition duration-300 border-t-4 ${benefit.bordercolor}`}
            >
              <h3 className={`text-xl font-bold mb-4 ${benefit.color}`}>{benefit.title}</h3>
              <ul className="space-y-3 text-gray-700">
                {benefit.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className={clsx( `w-2.5 h-2.5 mt-2 rounded-full ${benefit.bgcolor} mr-3`)}></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Hear From Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {employees.map((employee) => (
              <div key={employee.id} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
                <div className="flex items-center mb-6">
                  <img
                    src={employee.image}
                    alt={employee.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-800">{employee.name}</h4>
                    <p className="text-blue-500">{employee.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{employee.testimonial}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-10 text-center text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Team?</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Enjoy these amazing benefits and more as part of the EV Power I family.
          </p>
          <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition duration-300 shadow-lg hover:shadow-xl">
            Continue Your Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeBenefits;
