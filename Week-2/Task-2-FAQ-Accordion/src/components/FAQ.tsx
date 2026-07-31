import { useState } from "react";
import FAQItem from "./FAQItem";

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is React?",
      answer: "React is a JavaScript library for building user interfaces.",
    },
    {
      question: "What is TypeScript?",
      answer: "TypeScript is JavaScript with static typing.",
    },
    {
      question: "What is Tailwind CSS?",
      answer: "Tailwind CSS is a utility-first CSS framework.",
    },
    {
      question: "What is Vite?",
      answer: "Vite is a fast build tool for modern web projects.",
    },
    {
      question: "What are React Components?",
      answer: "Components are reusable pieces of UI.",
    },
    {
      question: "Why use React State?",
      answer: "State helps manage changing data in a React application.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h1>

      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openIndex === index}
          onClick={() =>
            setOpenIndex(openIndex === index ? null : index)
          }
        />
      ))}
    </div>
  );
}

export default FAQ;