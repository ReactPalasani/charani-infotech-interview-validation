"use client";

import { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { CheckCircle, Download, UserPlus, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

function HrPortal_Exam() {
  const [response, setResponse] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [studentIdSearch, setstudentIdSearch] = useState("");
  const [correctAnswersSearch, setCorrectAnswersSearch] = useState("");
  const [collgeNameSearch, setCollegeNameSearch] = useState("");
  const [percentageSearch, setPercentageSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  // 1. Auth & Hydration Check
  useEffect(() => {
    setHasMounted(true);
    const admin = JSON.parse(localStorage.getItem('AdminLogin'));
    if (!admin) {
      router.push('/admin');
    }
  }, [router]);

  // 2. Fetch Data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/finalSelectCandiates");
        const data = await res.json();

        if (data.success) {
          const flattened = Object.entries(data.data || {}).flatMap(
            ([studentId, collegeObj]) =>
              Object.entries(collegeObj).map(([resultId, value]) => ({
                id: resultId,
                studentId,
                ...value,
              }))
          );
          setStudentData(flattened);
        }
      } catch (error) {
        setResponse(
          <div className='flex justify-center text-red-800 font-bold mt-6'>
            Error fetching users
          </div>
        );
      }
    };
    fetchStudents();
  }, []);

  // 4. Filtering Logic
  const filteredData = useMemo(() => {
    return studentData.filter(student => {
      const matchStudentId = studentIdSearch ? student.studentId?.toLowerCase().includes(studentIdSearch.toLowerCase()) : true;
      const matchCollege = collgeNameSearch ? student.collegeName?.toLowerCase().includes(collgeNameSearch.toLowerCase()) : true;
      const matchCorrectAnswers = correctAnswersSearch ? Number(student.correctAnswers) >= Number(correctAnswersSearch) : true;
      const matchPercentage = percentageSearch ? Number(student.percentage) >= Number(percentageSearch) : true;

      return matchStudentId && matchCollege && matchCorrectAnswers && matchPercentage;
    });
  }, [studentData, studentIdSearch, collgeNameSearch, correctAnswersSearch, percentageSearch]);

  // 5. Excel Download
  const downloadExcel = () => {
    if (!filteredData.length) return;
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, "Technical_Round_Results.xlsx");
  };

  // 6. Columns
  const columns = [
    { name: "S.No", cell: (row, index) => index + 1, width: "70px" },
    { name: "Name", selector: row => row.studentName, sortable: true },
    { name: "Email", selector: row => row.studentEmail, sortable: true, width: "220px" },
    { name: "Student ID", selector: row => row.studentId, sortable: true },
    { name: "College Name", selector: row => row.collegeName, sortable: true, width: "200px" },
  ];

  if (!hasMounted) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 mt-4">Final Select</h1>

      <div className="flex gap-4 mb-6 flex-wrap bg-white p-5 rounded-lg shadow-sm items-end border border-gray-100">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">College Name</label>
          <input
            type="text"
            placeholder="Search College..."
            value={collgeNameSearch}
            onChange={e => setCollegeNameSearch(e.target.value)}
            className="border px-3 py-2 rounded w-52 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Student ID</label>
          <input
            type="text"
            placeholder="Search ID..."
            value={studentIdSearch}
            onChange={e => setstudentIdSearch(e.target.value)}
            className="border px-3 py-2 rounded w-44 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex gap-3 ml-auto">
          <button
            onClick={downloadExcel}
            className="flex items-center justify-center gap-2 bg-green-700 text-white px-6 py-[9px] rounded font-bold hover:bg-green-800 transition shadow-sm"
          >
            <Download size={18} /> Download Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          responsive
        />
      </div>

      {response}
    </div>
  );
}

export default HrPortal_Exam;