"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SwitchTabs from "./Switching-Exam-Result-Pannels";
function Header() {
  const [student, setStudent] = useState(null);
   const [admin, setAdmin] = useState(null);
   const route=useRouter();
  useEffect(() => {
    const data = localStorage.getItem("StudentData");
    if (data) setStudent(JSON.parse(data));
  }, []);

    useEffect(() => {
    const data = localStorage.getItem("AdminLogin");
    if (data){ setAdmin(JSON.parse(data), localStorage.removeItem("StudentData") );
    }
  }, []);

const handleLogout=()=>{
  localStorage.clear();
  route.push("/admin");
}

  return (
    <header className="bg-blue-900 flex justify-between p-2 text-white items-center">
      <div className="flex gap-2 items-center">
        <img
          src="/charani-logo.jpeg"
          width={50}
          alt="Charani logo"
          className="border border-white rounded-full"
        />
        <strong className="text-lg">Charani Infotech</strong>
      </div>
      {admin &&
           <SwitchTabs/>
      }
      {student && (
        <h1>
          <span className="font-bold">Candidate:</span> {student.studentId}
        </h1>
      )}

      {admin &&(
      <button className="font-bold" onClick={handleLogout}>Log-out</button>
      )
      }
    </header>
  );
}

export default Header;
