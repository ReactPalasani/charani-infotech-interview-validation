"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Footer from "./Footer";

export default function ResultPageContent() {
  const [result, setResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const studentData = JSON.parse(localStorage.getItem("StudentData"));
     console.log("Student local storage data",studentData);
    if (!studentData?.email) {
      router.replace("/registration");
      return;
    }

//     const fetchResult = async () => {
//       try {
//         const res = await fetch("/api/result");
//         const data = await res.json();
//          console.log("Api data",data.data);
//         if (!data.success) return;

//         const allResults = Object.values(data.data || {}).flatMap(college =>
//           Object.values(college)
//         );

//         // const studentResult = allResults
//         //   .filter(r => r.studentEmail === studentData.email)
//         //   .sort(
//         //     (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
//         //   )[0];
//         const studentResult = allResults
//   .filter(r => r && r.studentEmail === studentData.email)
//   .sort(
//     (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
//   )[0];

// setResult(studentResult || null);


//         setResult(studentResult);
//       } catch (error) {
//           throw error;
//       }
//     };

const fetchResult = async () => {
  try {
    const res = await fetch("/api/result");
    const data = await res.json();

    if (!data.success) return;

    let allResults = [];

    if (Array.isArray(data.data)) {
      allResults = data.data;
    } else {
      allResults = Object.values(data.data || {}).flatMap(college =>
        Object.values(college || {})
      );
    }

    const studentEmail = studentData.email.trim().toLowerCase();

    const studentResult = allResults
      .filter(
        r =>
          r &&
          typeof r === "object" &&
          r.studentEmail &&
          r.studentEmail.trim().toLowerCase() === studentEmail
      )
      .sort(
        (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
      )[0];

    setResult(studentResult || null);
  } catch (error) {
    console.error("Result fetch failed:", error);
  }
  finally{
     localStorage.clear();
  };
};


    fetchResult();
  }, [router]);

  if (!result) {
    return <div className="p-6 text-center">Loading your result...</div>;
  }

  const handleBack = () => {
    // localStorage.removeItem("StudentData"); // ✅ only remove what you need
    localStorage.clear(); // ❌ avoid clearing everything
    router.replace("/registration");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Header />

      <h1 className="text-2xl font-bold mb-6 text-center">Exam Result</h1>

      <div className="max-w-md mx-auto bg-white p-6 rounded shadow-lg text-center mb-10">
        <p className="font-semibold">Name: {result.studentName}</p>
        <p className="font-semibold">Email: {result.studentEmail}</p>
        <p className="font-semibold">College: {result.collegeName}</p>
        <p className="font-semibold">College ID: {result.studentId}</p>

        <hr className="my-4" />

        <p className="text-xl font-bold">
          Total Questions: {result.totalQuestions}
        </p>
        <p className="text-xl font-bold text-green-600">
          Correct Answers: {result.correctAnswers}
        </p>
        <p className="text-xl font-bold text-red-600">
          Wrong Answers: {result.totalQuestions - result.correctAnswers}
        </p>

        <button
          onClick={handleBack}
          className="mt-6 flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded"
        >
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
      <Footer/>
    </div>
  );
}
