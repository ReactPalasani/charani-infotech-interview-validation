"use client";
import { useExam } from "@/context/ExamContext";
import { database } from "@/lib/firebase";
import { ref, push } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SubmitExamButton() {
  const { answers, questions, time } = useExam();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!confirm("Are you sure you want to submit the exam?")) return;
          const StudentData=JSON.parse(localStorage.getItem("StudentData")) || {};
    // 🔹 Student details from localStorage or form
    const studentName = StudentData.name || "Unknown";
    const studentEmail = StudentData.email || "Unknown";
    const collegeId = StudentData.collegeId || "Unknown";
    const collegeName = StudentData.collegeName || "Unknown";

    // 🔹 Calculate total and correct
    let totalQuestions = 0;
    let correctAnswers = 0;

    Object.keys(answers).forEach((section) => {
      const sectionQs = questions; // your questions array for this section
      console.log("Evaluating section:", section);
      const sectionAns = answers[section];
      console.log("Section:", section);
      console.log("Section Questions:", sectionQs);
      console.log("Section Answers:", sectionAns);

      sectionQs.forEach((q, idx) => {
        totalQuestions++;
        if (sectionAns[idx] === q.Answer){ correctAnswers++; console.log("Correct answer for question", );}
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
      const resultRef = ref(database, "ExamResults");
      await push(resultRef, resultData);

      // Clear timer and answers
      localStorage.removeItem("exam-time");
      alert("Exam submitted successfully!");
      router.push("/result");
    } catch (err) {
      console.error(err);
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
