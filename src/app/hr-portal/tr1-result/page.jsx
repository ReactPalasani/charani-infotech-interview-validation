"use client";

import { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { CheckCircle, Download, XCircle, UserPlus, Mail } from "lucide-react";
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
    if (!admin) router.push('/admin');
  }, [router]);

  // 2. Fetch Data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/tr1-result"); 
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

      }
    };
    fetchStudents();
  }, []);

  // 3. Move to Technical Interview Logic
  const handleMoveToTechnical = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    setResponse(<div className='fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-2 rounded shadow-lg font-bold'>Moving to Technical Round...</div>);

    let successCount = 0;
    let failCount = 0;

    for (const student of selectedRows) {
      const payload = {
        studentName: student.studentName,
        studentEmail: student.studentEmail, // Including Email
        studentId: student.studentId,
        collegeName: student.collegeName,
        totalQuestions: student.totalQuestions, // Including Total Questions
        correctAnswers: student.correctAnswers,
        percentage: student.percentage,
        submittedAt: student.submittedAt,
        feedback: "",
        topic: "",
        status: "",
        select: true 
      };

      try {
        const res = await fetch("/api/tr1-selected-candiates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) successCount++;
        else failCount++;
      } catch (error) {
        failCount++;
      }
    }

    setResponse(
      <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-2xl font-bold flex items-center gap-2 border-2 ${failCount === 0 ? 'bg-green-100 border-green-600 text-green-800' : 'bg-orange-100 border-orange-600 text-orange-800'}`}>
        {failCount === 0 ? <CheckCircle size={20} /> : <XCircle size={20} />}
        {successCount} Students moved to Technical Interview.
      </div>
    );
    
    setSelectedRows([]); 
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
      const matchId = studentIdSearch ? student.studentId?.toLowerCase().includes(studentIdSearch.toLowerCase()) : true;
      const matchCollege = collgeNameSearch ? student.collegeName?.toLowerCase().includes(collgeNameSearch.toLowerCase()) : true;
      const matchScore = correctAnswersSearch ? Number(student.correctAnswers) >= Number(correctAnswersSearch) : true;
      const matchPercent = percentageSearch ? Number(student.percentage) >= Number(percentageSearch) : true;
      return matchId && matchCollege && matchScore && matchPercent;
    });
  }, [studentData, studentIdSearch, collgeNameSearch, correctAnswersSearch, percentageSearch]);

  const downloadExcel = () => {
    if (!filteredData.length) return;
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Aptitude_Results");
    XLSX.writeFile(workbook, "Aptitude_Results.xlsx");
  };

  // 5. Columns Configuration
  const columns = [
    { name: "S.No", cell: (row, index) => index + 1, width: "60px" },
    { name: "Name", selector: row => row.studentName, sortable: true },
    { name: "Email", selector: row => row.studentEmail, sortable: true, width: "220px" },
    { name: "Student ID", selector: row => row.studentId, sortable: true, width: "120px" },
    { name: "College", selector: row => row.collegeName, sortable: true, width: "180px" },
    { name: "Total Qns", selector: row => row.totalQuestions, sortable: true, width: "100px" },
    { name: "Score", selector: row => row.correctAnswers, sortable: true, width: "80px" },
    { name: "Percent", selector: row => `${row.percentage}%`, sortable: true, width: "100px" },
    {
      name: (
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            onChange={handleSelectAll}
            checked={selectedRows.length === filteredData.length && filteredData.length > 0}
          />
          <span>Select</span>
        </div>
      ),
      width: "110px",
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
      <h1 className="text-2xl font-bold mb-4 mt-4">Technical Round-1 Result</h1>

      <div className="flex gap-4 mb-6 flex-wrap items-end bg-white p-5 rounded-lg shadow-sm">
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
            className="border px-3 py-2 rounded w-28 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* --- ACTION BUTTONS --- */}
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
            <UserPlus size={18} /> Shorlisted For Technical-2  ({selectedRows.length})
          </button>

          <button
            onClick={downloadExcel}
            className="flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded font-bold "
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