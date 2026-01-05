"use client";
import { useExam } from "@/context/Tr1Context";
import {CodeXml,Eclipse, ScrollText,Flame  } from "lucide-react";
import { useEffect, useState } from "react";

const SECTIONS = [
  { key: "Html", label: "Html", icon: CodeXml },
  { key: "Css3", label: "Css3", icon: Eclipse },
  { key: "Javascript", label: "Javascript", icon: ScrollText },
   { key: "Java", label: "Java", icon: Flame },
];

export default function SectionTabs() {
  const { section, setSection } = useExam();
  const [lockedSections, setLockedSections] = useState([]);

  // /* ---------- load locks ---------- */
  // useEffect(() => {
  //   try {
  //     const saved = localStorage.getItem("Lock-Tabs");
  //     if (saved) setLockedSections(JSON.parse(saved));
  //   } catch {
  //     localStorage.removeItem("Lock-Tabs");
  //   }
  // }, []);

  // /* ---------- persist locks ---------- */
  // useEffect(() => {
  //   localStorage.setItem("Lock-Tabs", JSON.stringify(lockedSections));
  // }, [lockedSections]);

  // const handleSectionChange = (newSection) => {
  //   if (newSection === section) return;
  //   if (lockedSections.includes(newSection)) return;

  //   setLockedSections((prev) =>
  //     prev.includes(section) ? prev : [...prev, section]
  //   );

  //   setSection(newSection);
  // };

  return (
    <div className="flex border w-1/2">
      {SECTIONS.map(({ key, label, icon: Icon }) => {
        const isLocked = lockedSections.includes(key);
        const isActive = section === key;

        return (
          <button
            key={key}
            disabled={isLocked}
            // onClick={() => handleSectionChange(key)}
            className={`flex-1 py-3 font-semibold transition border shadow
              flex items-center justify-center gap-2
              ${isActive ? "bg-blue-700 text-white" : "bg-white"}
              ${isLocked ? "opacity-50 cursor-not-allowed" : ""}
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
