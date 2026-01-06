"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {label:"Dashboard", path:"/hr-portal/dashboard"},
  { label: "Aptitude", path: "/hr-portal/exam-result" },
  { label: "Jam", path: "/hr-portal/jam-result" },
  { label: "Technical-1", path: "/hr-portal/tr1-result" },
  { label: "Technical-2", path: "/hr-portal/tr2-result" },
  { label: "HR", path: "/hr-portal/hr-result" },
  { label: "Selected Candiates", path: "/hr-portal/selectedList" },
  
];

export default function SwitchTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-6 text-white  rounded justify-center">
      {tabs.map(tab => {
        const isActive = pathname === tab.path;

        return (
          <Link
            key={tab.path}
            href={tab.path}
            className={`px-4 py-1 rounded font-bold transition
              ${isActive ? "bg-white text-black" : "hover:bg-gray-700"}
            `}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
