"use client";
import { useExam } from "@/context/ExamContext";
import { database } from "@/lib/firebase";
import { ref, push, set } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SubmitExamButton() {
  const { answers, questions, time, response, setResponse } = useExam();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!confirm("Are you sure you want to submit the exam?")) return;
    const StudentData = JSON.parse(localStorage.getItem("StudentData")) || {};
    // 🔹 Student details from localStorage or form
    const studentName = StudentData.name || "Unknown";
    const studentEmail = StudentData.email || "Unknown";
    const studentId = StudentData.studentId || "Unknown";
    const collegeName = StudentData.collegeName || "Unknown";

    // 🔹 Calculate total and correct
    let totalQuestions = 0;
    let correctAnswers = 0;

    Object.keys(answers).forEach((section) => {
      const sectionQs = questions; // your questions array for this section

      const sectionAns = answers[section];

      sectionQs.forEach((q, idx) => {
        totalQuestions++;
        if (sectionAns[idx] === q.Answer) { correctAnswers++;  }
      });
    });

    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    // 🔹 Result object
    const resultData = {
      studentName,
      studentEmail,
      studentId,
      collegeName,
      totalQuestions,
      correctAnswers,
      percentage,
      submittedAt: new Date().toISOString(),

    };

    try {
      const res = await fetch('/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("exam-time");
        setResponse(<div className='flex justify-center align-middle text-center text-green-800 mt-6 font-bold'>Exam submitted successfully! </div>);
           router.push("/result");
      } else {
      setResponse(<div className='flex justify-center align-middle text-center text-red-800 mt-6 font-bold'> Exam Submition Failed </div>);
         setTimeout(() => {
           setResponse("");
        },2000); 
      }
    } catch (error) {
      setResponse(<div className='flex justify-center align-middle text-center text-red-800 mt-6 font-bold'> Failed to submit exam </div>);
        setTimeout(() => {
           setResponse("");
        },2000);
    }
  };

  useEffect(() => {
    if (time <= 0) {
      handleSubmit(true); // auto submit
    }
  }, [time]);

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={handleSubmit}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
      >
        Final Submit
      </button>
    </div>
  );
}
