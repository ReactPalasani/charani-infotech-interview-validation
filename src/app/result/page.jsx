"use client";

import ResultPageContent from "@/components/ResultPageContent";
import { ExamProvider } from "@/context/ExamContext";


export default function ResultPage() {
  return (
    <ExamProvider>
      <ResultPageContent />
    </ExamProvider>
  );
}
