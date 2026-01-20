"use client";

import { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import Header from "@/components/Header";
import { CheckCircle, Download } from "lucide-react";
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
  const router = useRouter();

  // 1. Auth Check
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('AdminLogin'));
    if (!admin) {
      router.push('/admin');
    }
  }, [router]);

  // 2. Fetch Data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/result");
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
          setStudentData(data.data);
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

  // 3. Status Submit Logic (Bulk Selection)
  const handleBulkSelect = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    let hasError = false;

    for (const student of selectedRows) {
      const payload = {
        studentName: student.studentName,
        studentEmail: student.studentEmail,
        studentId: student.studentId,
        collegeName: student.collegeName,
        totalQuestions: student.totalQuestions,
        correctAnswers: student.correctAnswers,
        submittedAt: student.submittedAt,
        feedback: "",
        topic: "",
        score: student.correctAnswers,
        selectorName: "HR_Admin",
        select: true 
      };

      try {
        const res = await fetch("/api/jam-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!data.success) hasError = true;
      } catch (error) {

        hasError = true;
      }
    }

    if (!hasError) {
      setResponse(
        <div className='fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-green-100 border-2 border-green-600 text-green-800 px-6 py-2 rounded shadow-lg font-bold'>
          Selected students submitted successfully!
        </div>
      );
      setSelectedRows([]); 
    } else {
      setResponse(
        <div className='fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-red-100 border-2 border-red-600 text-red-800 px-6 py-2 rounded shadow-lg font-bold'>
          Some students already exist or an error occurred.
        </div>
      );
    }
    setTimeout(() => setResponse(null), 2000);
  };

  const handleCheckboxChange = (student) => {
    setSelectedRows((prev) =>
      prev.find((s) => s.id === student.id)
        ? prev.filter((s) => s.id !== student.id)
        : [...prev, student]
    );
  };

  // 4. Filtering Logic
  const filteredData = useMemo(() => {
    return studentData.filter(student => {
      const matchStudentId = studentIdSearch
        ? student.studentId?.toLowerCase().includes(studentIdSearch.toLowerCase())
        : true;
      const matchCollege = collgeNameSearch
        ? student.collegeName?.toLowerCase().includes(collgeNameSearch.toLowerCase())
        : true;
      const matchCorrectAnswers = correctAnswersSearch
        ? Number(student.correctAnswers) >= Number(correctAnswersSearch)
        : true;
      const matchPercentage = percentageSearch
        ? Number(student.percentage) >= Number(percentageSearch)
        : true;

      return matchStudentId && matchCollege && matchCorrectAnswers && matchPercentage;
    });
  }, [studentData, studentIdSearch, collgeNameSearch, correctAnswersSearch, percentageSearch]);

  // Excel Download Logic
  const downloadExcel = () => {
    if (!filteredData.length) return;
    const excelData = filteredData.map((row, index) => {
      const formattedRow = { "S.No": index + 1 };
      Object.entries(row).forEach(([key, value]) => {
        if (key !== "id") formattedRow[key] = value;
      });
      return formattedRow;
    });
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Aptitude Results");
    XLSX.writeFile(workbook, "Aptitude_Results.xlsx");
  };

  // 5. Columns Configuration
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => index + 1,
      width: "80px",
    },
    { name: "Name", selector: row => row.studentName, sortable: true },
    { name: "Email", selector: row => row.studentEmail, sortable: true, width: "250px" },
     { name: "Phone Number", selector: row => row.phone, sortable: true, width: "250px" },
    { name: "Student ID", selector: row => row.studentId, sortable: true },
    { name: "College Name", selector: row => row.collegeName, sortable: true, width: "250px" },
    { name: "Total Questions", selector: row => row.totalQuestions, sortable: true },
    { name: "Correct Answers", selector: row => row.correctAnswers, sortable: true },
    { name: "percentage", selector: row => row.percentage, sortable: true },
    { name: "Submitted At", selector: row => row.submittedAt, sortable: true },
    {
      name: "Selection",
      width: "100px",
      cell: row => (
        <input
          type="checkbox"
          className="w-5 h-5 cursor-pointer"
          checked={!!selectedRows.find((s) => s.id === row.id)}
          onChange={() => handleCheckboxChange(row)}
        />
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 mt-4">Aptitude Result</h1>

      {/* Filters & Actions Section */}
      <div className="flex gap-4 mb-4 flex-wrap bg-white p-4 rounded shadow-sm items-center">
        <input
          type="text"
          placeholder="Search By College Name"
          value={collgeNameSearch}
          onChange={e => setCollegeNameSearch(e.target.value)}
          className="border px-3 py-2 rounded w-60 outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Search By Student ID"
          value={studentIdSearch}
          onChange={e => setstudentIdSearch(e.target.value)}
          className="border px-3 py-2 rounded w-60 outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Min Correct Answers"
          value={correctAnswersSearch}
          onChange={e => setCorrectAnswersSearch(e.target.value)}
          className="border px-3 py-2 rounded w-60 outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Min Percentage"
          value={percentageSearch}
          onChange={e => setPercentageSearch(e.target.value)}
          className="border px-3 py-2 rounded w-60 outline-none focus:ring-2 focus:ring-blue-400"
        />
        
        {/* Bulk Select Button */}
        <button
          onClick={handleBulkSelect}
          className="bg-green-600 text-white px-6 py-2 rounded font-bold flex items-center gap-2 hover:bg-green-700 transition shadow-md"
        >
          <CheckCircle size={18} /> Select
        </button>

        {/* Excel Download Button */}
        <button
          onClick={downloadExcel}
          className="flex items-center gap-2 bg--700 text-white px-4 py-2 rounded "
        >
          <Download size={18} /> Download Excel
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded shadow">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          responsive
        />
      </div>

      {/* Response Message Popup */}
      {response}
    </div>
  );
}

export default HrPortal_Exam;