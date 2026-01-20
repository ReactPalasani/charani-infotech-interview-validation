"use client";

import { useExam } from "@/context/Tr1Context";
import { ArrowLeft, ArrowRight } from "lucide-react";

const sections = ["Html", "Css3", "Javascript", "Java"];

export default function ExamPanel() {
  const {
    section,
    setSection,
    questions,
    currentIndex,
    setCurrentIndex,
    answers,
    setAnswers,
    response,
    setResponse
  } = useExam();

  const question = questions[currentIndex];
  if (!question) return null;

  const sectionAnswers = answers[section] || {};

  const handleSelect = (opt) => {
    setAnswers({
      ...answers,
      [section]: {
        ...sectionAnswers,
        [currentIndex]: opt,
      },
    });
  };

  const isLastQuestion = currentIndex === questions.length - 1;

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex(i => i + 1);
      return;
    }

    // 🔒 Move to next section
    const currentSectionIndex = sections.indexOf(section);
    const nextSection = sections[currentSectionIndex + 1];

    if (nextSection) {
      setSection(nextSection);
      setCurrentIndex(0);
    } else {
      // ✅ Exam finished
                  setResponse(<div className='flex justify-center align-middle text-center text-green-800 font-bold mt-6'> ✅ You have reached to the end</div>);
           
         setTimeout(() => {
          setResponse("");
         }, 2000);
      // router.push("/result") later
    }
  };

  return (
    <div className="bg-white w-1/2 min-w-8/12  p-4 rounded-lg shadow">
      <h3 className="font-bold">
  Q{currentIndex + 1}. {question.question1}
</h3>

<div className="flex flex-col gap-2 mt-4">
  {["A", "B", "C", "D"].map((key) => {
    const isSelected = sectionAnswers[currentIndex] === key;
    return (
      <label 
        key={key} 
        className={`
          block cursor-pointer px-4 py-3 border rounded-lg transition-colors
          ${isSelected 
            ? "bg-green-900 text-white border-green-900" 
            : "bg-gray-100 hover:bg-blue-900 hover:text-white border-gray-900"}
        `}
      >
        <input
          type="radio"
          className="hidden" // Hides the actual radio circle
          name={`q-${currentIndex}`}
          checked={isSelected}
          onChange={() => handleSelect(key)}
        />
        <span className="font-medium mr-2">{key}.</span> {question[key]}
      </label>
    );
  })}
</div>

      <div className="flex justify-between mt-6">
        <button
          className="bg-black text-white px-4 py-2 rounded flex items-center"
          onClick={() => setCurrentIndex(i => i - 1)}
          disabled={currentIndex === 0}
        >
          Previous<ArrowLeft/>
        </button>

        <button
          className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center"
          onClick={handleNext}
        >
          {isLastQuestion ? "Next Section" : "Next"}<ArrowRight/>
        </button>
        {response}
      </div>
    </div>
  );
}