"use client";

import Header from "@/components/Header";


import SubmitExamButton from "@/components/SubmitExamButton";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";

import ExamLayout1 from "./layout";
import { ExamProvider } from "@/context/Tr1Context";
import SectionTabs from "@/components/Tr1SectionTab";
import Timer from "@/components/Tr1Timer";
import ExamPanel from "@/components/Tr1Pannel";
import QuestionPalette from "@/components/Tr1QuestionPalette";
export default function ExamPage() {
  const router=useRouter();
   const [StudentData, setStudentData] = useState(null);

useEffect(() => {
  const data = localStorage.getItem("StudentData");
  if (data) {
    setStudentData(JSON.parse(data));
  }
  else{
//  router.push('/registration');
  }
}, []);



  return (
    <ExamLayout1>
    <ExamProvider>
      
        <Header />
        <div className="bg-gray-100 min-h-screen pl-20">
        <div className=" flex gap-4 p-6 ">
        <SectionTabs />
        <Timer />
        </div>

        <div className="flex gap-4 p-6">
          <ExamPanel />
          <QuestionPalette />
        </div>
        {/* <SubmitExamButton /> */}
      </div>
    </ExamProvider>
    </ExamLayout1>
  );
}
