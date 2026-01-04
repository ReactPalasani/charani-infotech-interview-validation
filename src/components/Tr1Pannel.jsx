"use client";

import { useExam } from "@/context/Tr1Context";

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
      <h3>
        Q{currentIndex + 1}. {question.question1}
      </h3>

      {["A", "B", "C", "D"].map((key) => (
        <label key={key} className="block">
          <input
            type="radio"
            name={`q-${currentIndex}`}
            checked={sectionAnswers[currentIndex] === key}
            onChange={() => handleSelect(key)}
          />
          {question[key]}
        </label>
      ))}

      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => setCurrentIndex(i => i - 1)}
          disabled={currentIndex === 0}
        >
          Previous
        </button>

        <button
          className="bg-yellow-600 text-white px-4 py-2 rounded"
          onClick={handleNext}
        >
          {isLastQuestion ? "Next Section" : "Next"}
        </button>
        {response}
      </div>
    </div>
  );
}
