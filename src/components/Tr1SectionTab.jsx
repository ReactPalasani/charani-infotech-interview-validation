"use client";
import { useExam } from "@/context/Tr1Context";
import { CodeXml, Eclipse, ScrollText, Flame } from "lucide-react";

const SECTIONS = [
  { key: "Html", label: "Html", icon: CodeXml },
  { key: "Css3", label: "Css3", icon: Eclipse },
  { key: "Javascript", label: "Javascript", icon: ScrollText },
  { key: "Java", label: "Java", icon: Flame },
];

export default function SectionTabs() {
  const { section, setSection } = useExam();

  return (
    <div className="flex border w-1/2 min-w-8/12">
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
