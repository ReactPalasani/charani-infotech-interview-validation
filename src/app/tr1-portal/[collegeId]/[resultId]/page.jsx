
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { MessagesSquare, NotepadText, PencilLine } from "lucide-react";

export default function StudentDetailsPage() {
  const { resultId,studentId } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState(null);


  // Controlled form state
  const [feedback, setFeedback] = useState("");
  const [topic, setTopic] = useState("");
  const [score, setScore] = useState("");
  const [selectorName, setSelectorName] = useState("");
  const [select, setSelect] = useState(false); // optional

   useEffect(
  ()=>{
     const admin=  JSON.parse( localStorage.getItem('AdminLogin'));
     if(!admin){
      router.push('/admin');
     }
  },[]
 );

useEffect(() => {
  const fetchDetails = async () => {
    try {
      const res = await fetch("/api/result");
      const data = await res.json();

      

      if (!data.success || !data.data) return;

      const collegeResults = data.data[studentId];

      // ❌ No data for this college
      if (!collegeResults) {
        setStudent(null);
        return;
      }

      // ✅ Convert results object → array
      const flattened = Object.entries(collegeResults).map(
        ([id, value]) => ({
          id,
          ...value,
        })
      );

      // ✅ Find result by resultId
      const found = flattened.find(item => item.id !== resultId);

      setStudent(found || null);
    } catch (error) {

    }
  };

  fetchDetails();
}, [studentId, resultId]);

  if (!student) {
  return (
    <div className="p-6 text-center text-red-600">
      No result found for this College ID
    </div>
  );
}

  // Submit handler
  const handleSubmit = async () => {
    const payload = {
      studentName: student.studentName,
      studentEmail: student.studentEmail,
      studentId: student.studentId,
      collegeName: student.collegeName,
      totalQuestions: student.totalQuestions,
      correctAnswers: student.correctAnswers,
      submittedAt: student.submittedAt,
      feedback,
      selectorName,
      select:select
    };
 
    try {
      const res = await fetch("/api/tr1-Exam-Result", {
        method: "POST",    
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("Data submitted successfully!");
        router.back(); // optional: go back after submit
      } else {
        alert("user already exist.");
      }
    } catch (error) {

    }
  };

  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
        >
          ← Back
        </button>

        <div className="mb-4">
          <label htmlFor="selectorName" className="font-bold mr-2">
            Invigilator Name
          </label>
          <select
            id="selectorName"
            value={selectorName}
            onChange={e => setSelectorName(e.target.value)}
            className="border-2 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select</option>
            <option value="raja-sekhar">Raja Sekhar</option>
            <option value="faruk">Faruk</option>
            <option value="sathis">Sathis</option>
            <option value="vanitha">Vanitha</option>
            <option value="malika">Malika</option>
            <option value="bindu">Bindu</option>
            <option value="madhavi">Madhavi</option>
            <option value="nagendra">Nagendra</option>
            <option value="mohan-krishna">Mohan Krishna</option>
          </select>
        </div>

        {/* Main container */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Feedback Section */}
          <div className="flex-1 bg-white p-6 rounded shadow">
            <label
              className="font-bold flex items-center gap-2 mb-2"
              htmlFor="feedback"
            >
              <MessagesSquare /> Feedback
            </label>
            <textarea
              id="feedback"
              rows={6}
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              className="border-2 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your feedback here..."
            ></textarea>
          </div>

          {/* Student Details */}
          <div className="flex-1 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Student Details</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {student.studentName}</p>
              <p><strong>Email:</strong> {student.studentEmail}</p>
              <p><strong>College ID:</strong> {student.studentId}</p>
              <p><strong>College Name:</strong> {student.collegeName}</p>
              <p><strong>Total Questions:</strong> {student.totalQuestions}</p>
              <p><strong>Correct Answers:</strong> {student.correctAnswers}</p>
              <p><strong>Submitted At:</strong> {student.submittedAt}</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* <div className="flex-1">
                  <label
                    htmlFor="topic"
                    className="font-bold flex items-center gap-2 mb-1"
                  >
                    <NotepadText /> Topic
                  </label>
                  <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="border-2 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Topic Here"
                  />
                </div> */}

                {/* <div className="flex-1">
                  <label
                    htmlFor="score"
                    className="font-bold flex items-center gap-2 mb-1"
                  >
                    <PencilLine /> Score
                  </label>
                  <select
                    id="score"
                    value={score}
                    onChange={e => setScore(e.target.value)}
                    className="border-2 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="">Select Score</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div> */}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="select"
                  checked={select}
                  onChange={e => setSelect(e.target.checked)}
                  className="w-4 h-4 border-gray-400 rounded focus:ring-2 focus:ring-blue-400"
                />
                <label htmlFor="select" className="select-none text-gray-700">
                  Select (Optional)
                </label>
              </div>
            </div>
             <div className="flex justify-center px-2.5">
            <button
              onClick={handleSubmit}
              className="mt-6 bg-green-500 text-white font-bold px-5 py-2 rounded hover:bg-green-800 transition"
            >
              Submit
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
