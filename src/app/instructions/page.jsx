"use client";

import Header from "@/components/Header";
import InstructionsLayout from "./layout";
import { Info, AlertTriangle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

function InstructionsPage() {
  const [accepted, setAccepted] = useState(false);

  const router=useRouter();

  const handleStart = () => {
    if (accepted) {
      window.location.href = "/exam";
    }
  };
   const [StudentData, setStudentData] = useState(null);

useEffect(() => {
  const data = localStorage.getItem("StudentData");
  if (data) {
    setStudentData(JSON.parse(data));
  }
  else{
    window.location.href = "/registration";
  }
}, []);


  return (

    <div className="bg-gray-100 min-h-screen">
      <InstructionsLayout>
        <Header />
      </InstructionsLayout>

      <div className="flex justify-center px-4 py-8">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6 md:p-8">
          
          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-900 text-white p-2 rounded-full">
              <Info size={20} />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">
              Exam Instructions
            </h1>
          </div>

          <hr className="mb-6" />

          {/* Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-blue-50 text-blue-900">
                <tr>
                  <th className="px-4 py-3 text-left">Section</th>
                  <th className="px-4 py-3 text-center">Questions</th>
                  <th className="px-4 py-3 text-center">Marks</th>
                  <th className="px-4 py-3 text-center">Time</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {[
                  ["Aptitude", 20, 20, "20 mins"],
                  ["Reasoning", 20, 20, "20 mins"],
                  ["Communication", 20, 20, "20 mins"],
                  ["Total", 60, 60, "60 mins"],
                ].map(([name, q, m, t], i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-3 font-medium">{name}</td>
                    <td className="px-4 py-3 text-center">{q}</td>
                    <td className="px-4 py-3 text-center">{m}</td>
                    <td className="px-4 py-3 text-center">{t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr />
          </div>

          {/* Rules */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-blue-900 mb-2">
                <CheckCircle size={18} /> General Rules
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Ensure a stable internet connection</li>
                <li>Each question carries <b>1 mark</b></li>
                <li>Once submitted, sections cannot be revisited</li>
                <li>Timer starts automatically</li>
              </ul>
            </div>

            <div>
              <h3 className="flex items-center gap-2 font-semibold text-red-700 mb-2">
                <AlertTriangle size={18} /> Restrictions
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Do not refresh or press <b>Back</b></li>
                <li>Tab switching is monitored</li>
                <li>No calculators or mobile phones</li>
                <li>Auto-submit on time expiry</li>
              </ul>
            </div>
          </div>

          {/* Agreement */}
          <div className="flex items-start gap-3 p-4 border rounded-lg bg-gray-50 mb-6">
            <input
              type="checkbox"
              className="mt-1"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <p className="text-sm text-gray-700">
              I have read and understood all the section-wise weightage and exam
              rules. I am ready to begin my assignment.
            </p>
          </div>

          {/* CTA */}
          <button
             onClick={handleStart}
            disabled={!accepted}
            className={`w-full py-3 rounded-lg font-bold transition ${
              accepted
                ? "bg-blue-900 text-white hover:bg-blue-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            I AM READY TO START
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default InstructionsPage;
