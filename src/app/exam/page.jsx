// "use client";
// import { ExamProvider } from "@/context/ExamContext";
// import Header from "@/components/Header";
// import SectionTabs from "@/components/SectionTabs";
// import Timer from "@/components/Timer";
// import ExamPanel from "@/components/ExamPannel";
// import QuestionPalette from "@/components/QuestionsPalette";
// import SubmitExamButton from "@/components/SubmitExamButton";
// import { useRouter } from "next/navigation";
// import { useState,useEffect } from "react";
// import FullScreenComponent from "@/components/FullScreenComponent";
// import ExamLayout from "./layout";
// import Footer from "@/components/Footer";
// export default function ExamPage() {
//   const router=useRouter();
//    const [StudentData, setStudentData] = useState(null);

// useEffect(() => {
//   const data = localStorage.getItem("StudentData");
//   if (data) {
//     setStudentData(JSON.parse(data));
//   }
//   else{
//  router.push('/registration');
//   }
// }, []);



//   return (
//     <ExamLayout>
//     <ExamProvider>

//         <Header />
//               <div className="bg-gray-100 min-h-screen pl-20">
//         <div className=" flex gap-4 p-6  ">
//         <SectionTabs />
//         <Timer />
//         </div>

//         <div className="flex gap-4 p-6">
//           <ExamPanel />
//           <QuestionPalette />
//         </div>
//         {/* <SubmitExamButton /> */}
//       </div>
//     </ExamProvider>
//     <Footer/>
//     </ExamLayout>
//   );
// }

"use client";
import { ExamProvider } from "@/context/ExamContext";
import Header from "@/components/Header";
import SectionTabs from "@/components/SectionTabs";
import Timer from "@/components/Timer";
import ExamPanel from "@/components/ExamPannel";
import QuestionPalette from "@/components/QuestionsPalette";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ExamLayout from "./layout";
import Footer from "@/components/Footer";

export default function ExamPage() {
  const router = useRouter();
  const [studentData, setStudentData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1. Check Auth/Student Data
  useEffect(() => {
    const data = localStorage.getItem("StudentData");
    if (data) {
      setStudentData(JSON.parse(data));
    } else {
      router.push('/registration');
    }
  }, [router]);

  // 2. Monitor Fullscreen Changes (Detects Esc key press)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 3. Trigger Fullscreen (Must be called by onClick)
  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.error("Fullscreen blocked:", err);
      });
    }
  };

  // 4. Force User Interaction
  // If not fullscreen, show a "Start" button instead of the exam
  if (!isFullscreen) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">Exam Mode Ready</h1>
        <p className="mb-8 text-gray-400">You must enter Fullscreen mode to take the exam.</p>
        <button 
          onClick={enterFullscreen}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105"
        >
          Click to Start Exam & Enter Fullscreen
        </button>
      </div>
    );
  }

  // 5. Main Exam Content (Only renders if isFullscreen is true)
  return (
    <ExamLayout>
      <ExamProvider>
        <Header />
        <div className="bg-gray-100 min-h-screen pl-20">
          <div className="flex gap-4 p-6">
            <SectionTabs />
            <Timer />
          </div>
          <div className="flex gap-4 p-6">
            <ExamPanel />
            <QuestionPalette />
          </div>
        </div>
      </ExamProvider>
      <Footer />
    </ExamLayout>
  );
}

