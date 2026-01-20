"use client";

import { useExam } from "@/context/Tr1Context";
import SubmitExamButton from "./Tr1-SubmitExamButton";



export default function QuestionPalette() {
  const { questions, currentIndex, setCurrentIndex, answers, section } = useExam();
  const sectionAnswers = answers[section];

  return (
    < div>
     <h1 className="bg-black text-white flex justify-center p-2 font-bold">Question Palette </h1>
    <div className="w-full bg-white p-4  shadow  border">
      <div className="grid grid-cols-5 gap-4  rounded-2xl mt-5" >
        {questions.map((_, i) => (
          <button
            key={i}
            className={`p-2 border  rounded-sm
              ${i === currentIndex ? "bg-blue-800 text-white rounded-sm border " : ""}
              ${sectionAnswers[i] ? "bg-green-800 text-white rounded-sm border "  : ""}
            `
          }
          onClick={() => setCurrentIndex(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
 <div className="grid grid-cols-1 gap-3 mt-4 text-sm">
  <div className="flex items-center gap-2">
    <span className="w-4 h-4 rounded-full bg-green-900"></span>
    <b>Answered</b>
  </div>

  <div className="flex items-center gap-2">
    <span className="w-4 h-4 rounded-full bg-blue-900"></span>
    <b>Current</b>
  </div>

  <div className="flex items-center gap-2">
    <span className="w-4 h-4 rounded-full border border-gray-400 bg-white"></span>
    <b>Not Answered</b>
  </div>
  <SubmitExamButton/>
</div>

    </div>
    </div>
  );
}