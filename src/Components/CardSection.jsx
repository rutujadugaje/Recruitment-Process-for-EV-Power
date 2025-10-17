import React from "react";
import { Lightbulb, Leaf, ShieldCheck, Users, Star } from "lucide-react";

const CardSection = () => {
  const cardData = [
    {
      title: "Innovation",
      icon: <Lightbulb size={32} className="text-blue-500" />,
      description:
        "We embrace cutting-edge technology to push the limits of EV battery solutions.",
    },
    {
      title: "Sustainability",
      icon: <Leaf size={32} className="text-blue-500" />,
      description:
        "Our mission is to create eco-friendly, long-lasting battery solutions.",
    },
    {
      title: "Integrity",
      icon: <ShieldCheck size={32} className="text-blue-500" />,
      description:
        "Honesty and transparency drive our operations and decision-making.",
    },
    {
      title: "Collaboration",
      icon: <Users size={32} className="text-blue-500" />,
      description:
        "Teamwork and partnerships fuel our innovation and success.",
    },
    {
      title: "Excellence",
      icon: <Star size={32} className="text-blue-500" />,
      description:
        "We strive for perfection in every product and service we offer.",
    },
  ];

  return (
    <section className="py-16 bg-white text-navy">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center mb-12 text-navy">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="bg-white border border-blue-100 p-6 rounded-2xl shadow-md hover:shadow-xl transform transition duration-300 hover:scale-105"
            >
              <div className="mb-4 flex justify-center">{card.icon}</div>
              <h3 className="text-lg font-bold text-navy">{card.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardSection;
