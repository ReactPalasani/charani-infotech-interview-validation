"use client";

import { useExam, } from "@/context/ExamContext";
import { ArrowLeft, ArrowRight } from "lucide-react";

const sections = ["Aptitude", "Reasoning", "Communication"];

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
      // alert("Exam completed");
      // router.push("/result") later
      setResponse(<div className="flex justify-center align-middle text-center font-bold mt-6 text-green-800">You have reached to the end</div>)

      setTimeout(()=>{
        setResponse("");
      },3000);
    }
  };

  return (
    <div className="bg-white w-1/2 min-w-8/12  p-4 rounded-lg shadow">
      <h3 className="font-bold">
        Q{currentIndex + 1}. {question.question1}
      </h3>

      {/* {["A", "B", "C", "D"].map((key) => (
        <label key={key} className="block">
          <input
            type="radio"
            name={`q-${currentIndex}`}
            checked={sectionAnswers[currentIndex] === key}
            onChange={() => handleSelect(key)}
          />
          {question[key]}
        </label>
      ))} */}
      <div className="mt-4 space-y-3">
  {["A", "B", "C", "D"].map((key) => (
    <button
      key={key}
      onClick={() => handleSelect(key)}
      className={`w-full text-left px-4 py-2 rounded border
        ${
          sectionAnswers[currentIndex] === key
            ? "bg-green-800 text-white border-blue-600"
            : "bg-white text-gray-800 border-gray-300 hover:bg-blue-900 hover:text-white"
        }`}
    >
      <span className="font-semibold mr-2">{key}.</span>
      {question[key]}
    </button>
  ))}
</div>


      <div className="flex justify-between mt-6">
        <button
          className="bg-black text-white px-4 py-2 rounded flex items-center"
          onClick={() => setCurrentIndex(i => i - 1)}
          disabled={currentIndex === 0}
        >
        <ArrowLeft/> Previous 
        </button>

        <button
          className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center"
          onClick={handleNext}
        >
          {isLastQuestion ? "Next Section" : "Next"}  <ArrowRight/>
        </button>
      </div>
      {response}
    </div>
  );
}
