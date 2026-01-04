"use client";
import { useExam } from "@/context/Tr1Context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SubmitExamButton() {
  const { answers, questions, time } = useExam();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!confirm("Are you sure you want to submit the exam?")) return;
    const StudentData = JSON.parse(localStorage.getItem("StudentData")) || {};
    // 🔹 Student details from localStorage or form
    const studentName = StudentData.studentName || "Unknown";
    const studentEmail = StudentData.studentEmail || "Unknown";
    const collegeId = StudentData.collegeId || "Unknown";
    const collegeName = StudentData.collegeName || "Unknown";

    // 🔹 Calculate total and correct
    let totalQuestions = 0;
    let correctAnswers = 0;

    Object.keys(answers).forEach((section) => {
      const sectionQs = questions; // your questions array for this section

      const sectionAns = answers[section];


      sectionQs.forEach((q, idx) => {
        totalQuestions++;
        if (sectionAns[idx] === q.Answer) { correctAnswers++; }
      });
    });

    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    // 🔹 Result object
    const resultData = {
      studentName,
      studentEmail,
      collegeId,
      collegeName,
      totalQuestions,
      correctAnswers,
      percentage,
      submittedAt: new Date().toISOString(),

    };

    try {
      const res = await fetch('/api/tr1-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.removeItem("exam-time");
        alert("Exam submitted successfully!");
        router.push("/tr-result");
      } else {
        alert('Exam Submition Failed');
      }
    } catch (error) {

      alert("Failed to submit exam.");
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
