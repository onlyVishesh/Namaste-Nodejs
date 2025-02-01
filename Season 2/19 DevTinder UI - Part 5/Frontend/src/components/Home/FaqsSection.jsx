import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "How does DevRoot help developers find collaborators?",
    answer:
      "DevRoot uses an AI-powered matching algorithm that analyzes your skills, experience, and project preferences to connect you with the most suitable developers for collaboration.",
  },
  {
    question: "Is DevRoot free to use?",
    answer:
      "Yes, DevRoot offers a free tier that allows developers to connect, collaborate, and work on projects together. Additional premium features are available for advanced users.",
  },
  {
    question: "How can I showcase my projects on DevRoot?",
    answer:
      "You can create a developer profile and upload your projects, including GitHub links, descriptions, and tech stacks. Other developers can view, collaborate, and provide feedback.",
  },
  {
    question: "What features does DevRoot offer for project management?",
    answer:
      "DevRoot provides task management, integrated chat, issue tracking, and version control integration to help developers efficiently manage their projects.",
  },
  {
    question: "How does DevRoot ensure high-quality connections?",
    answer:
      "Our system filters potential connections based on expertise, coding activity, and feedback from past collaborations, ensuring meaningful and productive connections.",
  },
  // {
  //   question: "Can I switch between different plans?",
  //   answer:
  //     "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  // },
];
  


const FaqsSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-bgSecondary px-8 py-20 rounded-xl" id="faqs" >
      <div className="mx-auto max-w-6xl text-center">
        <div className="mb-4 md:mb-12">
          <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-lg text-textMuted">
            Everything you need to know about DevRoot
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-lg border border-border bg-bg">
              <button
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold text-text">{faq.question}</span>
                <FaChevronDown
                  className={`h-6 w-6 transform text-primary transition-transform ${
                    openIndex === index ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-left text-textMuted">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqsSection;
