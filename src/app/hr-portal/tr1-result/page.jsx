"use client";

import { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { useRouter } from "next/navigation";

function HrPortal_Exam() {
  const [studentData, setStudentData] = useState([]);
  const [studentIdSearch, setstudentIdSearch] = useState("");
  const [collegeNameSearch, setCollegeNameSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('AdminLogin'));
    if (!admin) {
      router.push('/admin');
    }
  }, [router]);

  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        const res = await fetch("/api/tr1-Exam-Result"); // API fetching Evaluation results
        const data = await res.json();
        if (data.success) {
          // Flattening assuming it follows the Evaluation data structure
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
        console.error("Error fetching results");
      }
    };
    fetchExamResults();
  }, []);

  const filteredData = useMemo(() => {
    return studentData.filter(student => {
      const matchId = studentIdSearch ? student.studentId?.toLowerCase().includes(studentIdSearch.toLowerCase()) : true;
      const matchCollege = collegeNameSearch ? student.collegeName?.toLowerCase().includes(collegeNameSearch.toLowerCase()) : true;
      return matchId && matchCollege;
    });
  }, [studentData, studentIdSearch, collegeNameSearch]);

  const columns = [
    { name: "S.No", cell: (row, index) => index + 1, width: "80px" },
    { name: "Name", selector: row => row.studentName, sortable: true },
    { name: "Student ID", selector: row => row.studentId, sortable: true },
    { name: "Topic", selector: row => row.topic || "N/A", sortable: true },
    { name: "Invigilator", selector: row => row.selectorName || "N/A", sortable: true },
    { name: "Feedback", selector: row => row.feedback, sortable: true, width: "300px" },
    { name: "Shortlisted", selector: row => row.select ? "✅ Yes" : "❌ No", sortable: true },
    { name: "Submitted At", selector: row => row.submittedAt, sortable: true },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Evaluation Records</h1>

      <div className="flex gap-4 mb-4 flex-wrap">
        <input type="text" placeholder="Search ID" value={studentIdSearch} onChange={e => setstudentIdSearch(e.target.value)} className="border px-3 py-2 rounded w-64 shadow-sm" />
        <input type="text" placeholder="Search College" value={collegeNameSearch} onChange={e => setCollegeNameSearch(e.target.value)} className="border px-3 py-2 rounded w-64 shadow-sm" />
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable columns={columns} data={filteredData} pagination highlightOnHover striped responsive />
      </div>
    </div>
  );
}

export default HrPortal_Exam;