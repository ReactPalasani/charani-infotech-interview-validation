"use client";

import ResultPageContent from "@/components/Tr1-ResultPage";
import { ExamProvider } from "@/context/Tr1Context";


export default function ResultPage() {
  return (
    <ExamProvider>
      <ResultPageContent/>
    </ExamProvider>
  );
}