"use client";
import { useEffect, useState } from "react";
import { database } from "@/lib/firebase";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
export default function ResultPageContent() {
  const [result, setResult] = useState(null);
  const router=useRouter();
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const studentEmail = JSON.parse(localStorage.getItem("StudentData"))?.email;
        if (!studentEmail) return;

        const resultsRef = ref(database, "ExamResults");
        const snapshot = await get(resultsRef);

        if (snapshot.exists()) {
          // Get the latest submission for this student
          const allResults = Object.values(snapshot.val());
          const studentResult = allResults
            .filter(r => r.studentEmail === studentEmail)
            .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];

          setResult(studentResult);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchResult();
  }, []);

  if (!result){
    return <div className="p-6 text-center">Loading your result...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Header />

      <h1 className="text-2xl font-bold mb-6 text-center">Exam Result</h1>

      <div className="max-w-md mx-auto bg-white p-6 rounded shadow-lg text-center">
        <p className="text-lg font-semibold mb-2">Name: {result.studentName}</p>
        <p className="text-lg font-semibold mb-2">Email: {result.studentEmail}</p>
        <p className="text-lg font-semibold mb-2">College: {result.collegeName}</p>
        <p className="text-lg font-semibold mb-2">College ID: {result.collegeId}</p>

        <hr className="my-4" />

        <p className="text-xl font-bold mb-2">
          Total Questions: {result.totalQuestions}
        </p>
        <p className="text-xl font-bold mb-2">
          Correct Answers: {result.correctAnswers}
        </p>

        <p className="text-xl font-bold mb-2">
          Wrong Answers: {result.totalQuestions - result.correctAnswers}
        </p>
              <button className=" flex bg-blue-900 text-white  p-2 rounded-sm" onClick={()=>{localStorage.clear(); router.push('/registration')}}> < ArrowLeft/>Go Back </button>
      </div>

    </div>
  );
}
