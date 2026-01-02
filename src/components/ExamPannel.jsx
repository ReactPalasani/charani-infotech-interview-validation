
'use client';

import { useExam } from "@/context/ExamContext";



export default function ExamPanel() {
  const {
    section,
    questions,
    currentIndex,
    setCurrentIndex,
    answers,
    setAnswers,
  } = useExam();

  const question = questions[currentIndex];
  if (!question) return null;

  const sectionAnswers = answers[section];

  const handleSelect = (opt) => {
    setAnswers({
      ...answers,
      [section]: {
        ...sectionAnswers,
        [currentIndex]: opt,
      },
    });
  };

  return (
    <div className="bg-white w-1/2 min-w-10/12  p-4 rounded-lg shadow">
      <h3>
        Q{currentIndex + 1}. {question.question1}
      </h3>

  {["A", "B", "C", "D"].map((key) => (
  <label key={key} className="block">
    <input
      type="radio"
      name={`q-${currentIndex}`}
      checked={sectionAnswers[currentIndex] === key}
      onChange={() => handleSelect(key)} // ✅ STORE KEY
    />
    {question[key]} {/* ✅ SHOW VALUE */}
  </label>
))}
      <div className="flex justify-between mt-6">
        <button  className=" bg-gray-600      text-white  rounded   "  onClick={() => setCurrentIndex(i => i - 1)} disabled={currentIndex === 0}>
          Previous
        </button>
        <button className="bg-blue-700 text-white p-2 shadow-2xl rounded " onClick={() => setCurrentIndex(i => i + 1)} disabled={currentIndex === questions.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
}
