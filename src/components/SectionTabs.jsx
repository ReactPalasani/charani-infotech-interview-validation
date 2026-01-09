"use client";

import { useExam } from "@/context/ExamContext";
import { Users, Brain, MessageSquare } from "lucide-react";

const SECTIONS = [
  { key: "Aptitude", label: "Aptitude", icon: Users },
  { key: "Reasoning", label: "Reasoning", icon: Brain },
  { key: "Communication", label: "Communication", icon: MessageSquare },
];

export default function SectionTabs() {
  const { section, setSection } = useExam();

  return (
    <div className="flex border w-1/2 min-w-8/12 ">
      {SECTIONS.map(({ key, label, icon: Icon }) => {
        const isActive = section === key;

        return (
          <button
            key={key}
            onClick={() => setSection(key)}
            className={`flex-1 py-3 font-semibold transition border shadow
              flex items-center justify-center gap-2
              ${isActive ? "bg-blue-900 text-white" : "bg-white"}
            `}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
