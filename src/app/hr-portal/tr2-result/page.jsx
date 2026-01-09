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
        const res = await fetch("/api/tr1-selected-candiates");
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

  // 3. Move Logic
  const handleMoveToTechnical = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    setResponse(<div className='fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-2 rounded shadow-lg font-bold'>Processing Move...</div>);

    let hasError = false;
    let successCount = 0;

    for (const student of selectedRows) {
      const payload = {
        studentName: student.studentName,
        studentEmail: student.studentEmail,
        studentId: student.studentId,
        collegeName: student.collegeName,
        totalQuestions: student.totalQuestions,
        correctAnswers: student.correctAnswers,
        submittedAt: student.submittedAt,
        percentage: student.percentage,
        feedback: "",
        topic: "",
        score: student.correctAnswers,
        selectorName: "HR_Admin",
        Aptitude_select: true
      };

      try {
        const res = await fetch("/api/tr2-selected-candiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.success) successCount++;
        else hasError = true;
      } catch (error) {

        hasError = true;
      }
    }

    if (!hasError) {
      setResponse(
        <div className='fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-green-100 border-2 border-green-600 text-green-800 px-6 py-2 rounded shadow-lg font-bold flex items-center gap-2'>
          <CheckCircle size={18} /> {successCount} Students moved successfully!
        </div>
      );
      setSelectedRows([]); 
    } else {
      setResponse(
        <div className='fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-red-100 border-2 border-red-600 text-red-800 px-6 py-2 rounded shadow-lg font-bold flex items-center gap-2'>
          <XCircle size={18} /> Error moving some students.
        </div>
      );
    }
    setTimeout(() => setResponse(null), 3000);
  };

  const handleCheckboxChange = (student) => {
    setSelectedRows((prev) =>
      prev.find((s) => s.id === student.id)
        ? prev.filter((s) => s.id !== student.id)
        : [...prev, student]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedRows(filteredData);
    else setSelectedRows([]);
  };

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
    { name: "Total Qns", selector: row => row.totalQuestions, sortable: true, width: "100px" },
    { name: "Score", selector: row => row.correctAnswers, sortable: true, width: "90px" },
    { name: "Percent", selector: row => `${row.percentage}%`, sortable: true, width: "90px" },
    {
      name: (
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            className="w-4 h-4 cursor-pointer" 
            onChange={handleSelectAll}
            checked={selectedRows.length === filteredData.length && filteredData.length > 0}
          />
          <span className="text-xs">Select All</span>
        </div>
      ),
      width: "120px",
      cell: row => (
        <input
          type="checkbox"
          className="w-5 h-5 cursor-pointer accent-blue-600"
          checked={!!selectedRows.find((s) => s.id === row.id)}
          onChange={() => handleCheckboxChange(row)}
        />
      ),
    },
  ];

  if (!hasMounted) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 mt-4">Selected For Technical Round-2</h1>

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

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Min Score</label>
          <input
            type="number"
            value={correctAnswersSearch}
            onChange={e => setCorrectAnswersSearch(e.target.value)}
            className="border px-3 py-2 rounded w-32 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex gap-3 ml-auto">
          <button
            onClick={handleMoveToTechnical}
            disabled={selectedRows.length === 0}
            className={`flex items-center gap-2 px-6 py-2.5 rounded font-bold transition shadow-md ${
              selectedRows.length > 0 
              ? "bg-green-600 text-white hover:bg-green-700 active:scale-95" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <UserPlus size={18} /> Move to Next Round ({selectedRows.length})
          </button>

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