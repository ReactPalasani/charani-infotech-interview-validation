"use client";

import { useExam } from "@/context/ExamContext";
import { Users, Brain, MessageSquare } from "lucide-react";

/**
 * SECTIONS configuration
 * Defines the navigation tabs for the exam.
 */
const SECTIONS = [
  { key: "Aptitude", label: "Aptitude", icon: Users },
  { key: "Reasoning", label: "Reasoning", icon: Brain },
  { key: "Communication", label: "Communication", icon: MessageSquare },
];

export default function SectionTabs() {
  // Accessing the current section and the setter function from your ExamContext
  const { section, setSection } = useExam();

  /**
   * Updates the global exam state to the selected section.
   * This allows the user to jump back and forth between subjects.
   */
  const handleSectionChange = (newSection) => {
    if (newSection !== section) {
      setSection(newSection);
    }
  };

  return (
    <div className="flex border w-full md:w-1/2 rounded-md overflow-hidden">
      {SECTIONS.map(({ key, label, icon: Icon }) => {
        const isActive = section === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => handleSectionChange(key)}
            className={`
              flex-1 py-3 font-semibold transition-all duration-200 border-r last:border-r-0
              flex items-center justify-center gap-2
              ${isActive 
                ? "bg-blue-700 text-white shadow-inner" 
                : "bg-white text-gray-600 hover:bg-gray-100 hover:text-blue-700"
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden text-xs">{label.substring(0, 3)}</span>
          </button>
        );
      })}
    </div>
  );
}