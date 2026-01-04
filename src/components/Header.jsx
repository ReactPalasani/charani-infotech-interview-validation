"use client";
import { useEffect, useState } from "react";

function Header() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("StudentData");
    if (data) setStudent(JSON.parse(data));
  }, []);

  return (
    <header className="bg-blue-900 flex justify-between p-2 text-white items-center">
      <div className="flex gap-2 items-center">
        <img
          src="/charani-logo.jpeg"
          width={50}
          alt="Charani logo"
          className="border border-white rounded-full"
        />
        <strong className="text-lg">Charani Info Tech</strong>
      </div>

      {student && (
        <h1>
          <span className="font-bold">Candidate:</span> {student.studentId}
        </h1>
      )}
    </header>
  );
}

export default Header;
