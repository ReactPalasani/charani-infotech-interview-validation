"use client";

import { useExam } from "@/context/ExamContext";


export default function QuestionPalette() {
  const { questions, currentIndex, setCurrentIndex, answers, section } = useExam();
  const sectionAnswers = answers[section];

  return (
    <div className="w-1/4 bg-white p-4  shadow  border rounded-2xl">
      <div className="grid grid-cols-5 gap-4  rounded-2xl">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`p-2 border 
              ${i === currentIndex ? "bg-blue-600 text-white rounded-2xl border " : ""}
              ${sectionAnswers[i] ? "bg-green-500 text-white rounded-2xl border "  : ""}
            `}
          >
            {i + 1}
          </button>
        ))}
      </div>
 <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
  <div className="flex items-center gap-2">
    <span className="w-4 h-4 rounded-full bg-green-500"></span>
    <b>Answered</b>
  </div>

  <div className="flex items-center gap-2">
    <span className="w-4 h-4 rounded-full bg-blue-600"></span>
    <b>Current</b>
  </div>

  <div className="flex items-center gap-2">
    <span className="w-4 h-4 rounded-full border border-gray-400 bg-white"></span>
    <b>Not Answered</b>
  </div>
</div>

    </div>
  );
}
