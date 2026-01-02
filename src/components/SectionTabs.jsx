"use client";

import { useExam } from "@/context/ExamContext";
import { useEffect, useState } from "react";

export default function SectionTabs() {
  const { section, setSection } = useExam();

  const sections = ["Aptitude", "Reasoning", "Communication"];
  const [lockedSections, setLockedSections] = useState([]);

  // 🔹 Load locked sections safely
  useEffect(() => {
    try {
      const savedLocks = localStorage.getItem("Lock-Tabs");
      if (savedLocks) {
        const parsed = JSON.parse(savedLocks);
        if (Array.isArray(parsed)) {
          setLockedSections(parsed);
        }
      }
    } catch {
      localStorage.removeItem("Lock-Tabs");
    }
  }, []);

  // 🔹 Save locked sections
  useEffect(() => {
    localStorage.setItem(
      "Lock-Tabs",
      JSON.stringify(lockedSections)
    );
  }, [lockedSections]);

  const handleSectionChange = (newSection) => {
     if (newSection === section) return;
    if (lockedSections.includes(newSection)) return;

    setLockedSections((prev) =>
      prev.includes(section) ? prev : [...prev, section]
    );

    setSection(newSection);
  };

  return (
    <div className="flex border-b bg-white">
      {sections.map((s) => {
        const isLocked = lockedSections.includes(s);

        return (
          <button
            key={s}
            disabled={isLocked}
            onClick={() => handleSectionChange(s)}
            className={`flex-1 py-3 font-semibold transition
              ${section === s ? "bg-blue-700 text-white" : "bg-gray-100"}
              ${isLocked ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
