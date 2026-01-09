"use client";
import { ExamProvider } from "@/context/ExamContext";
import Header from "@/components/Header";
import SectionTabs from "@/components/SectionTabs";
import Timer from "@/components/Timer";
import ExamPanel from "@/components/ExamPannel";
import QuestionPalette from "@/components/QuestionsPalette";
import SubmitExamButton from "@/components/SubmitExamButton";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import FullScreenComponent from "@/components/FullScreenComponent";
import ExamLayout from "./layout";
export default function ExamPage() {
  const router=useRouter();
   const [StudentData, setStudentData] = useState(null);

useEffect(() => {
  const data = localStorage.getItem("StudentData");
  if (data) {
    setStudentData(JSON.parse(data));
  }
  else{
 router.push('/registration');
  }
}, []);



  return (
    <ExamLayout>
    <ExamProvider>

        <Header />
              <div className="bg-gray-100 min-h-screen pl-20">
        <div className=" flex gap-4 p-6  ">
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
    </ExamLayout>
  );
}
