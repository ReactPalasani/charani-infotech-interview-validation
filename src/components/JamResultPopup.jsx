"use client";

import React, { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import Header from "@/components/Header";
import { View } from "lucide-react";
import { useRouter } from "next/navigation";

function JamResultPage() {
  const [studentData, setStudentData] = useState([]);
  const [studentIdSearch, setStudentIdSearch] = useState("");
  const [collegeNameSearch, setCollegeNameSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Auth Check
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('AdminLogin'));
    if (!admin) {
      router.push('/admin');
    }
  }, [router]);

  // 2. Data Fetching
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/tr1-result"); // Adjust endpoint if JAM uses a different one
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

      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // 3. Search Logic
  const filteredData = useMemo(() => {
    return studentData.filter((student) => {
      const matchStudentId = student.studentId
        ?.toLowerCase()
        .includes(studentIdSearch.toLowerCase());
      const matchCollegeName = student.collegeName
        ?.toLowerCase()
        .includes(collegeNameSearch.toLowerCase());

      return (studentIdSearch === "" || matchStudentId) && 
             (collegeNameSearch === "" || matchCollegeName);
    });
  }, [studentData, studentIdSearch, collegeNameSearch]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => index + 1,
      width: "80px",
    },
    { name: "Name", selector: (row) => row.studentName, sortable: true },
    { name: "Student ID", selector: (row) => row.studentId, sortable: true },
    { name: "College", selector: (row) => row.collegeName, sortable: true, width: "200px" },
    { name: "Score", selector: (row) => row.correctAnswers, sortable: true },
    { name: "Percentage", selector: (row) => `${row.percentage}%`, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => router.push(`/hr-portal/jam-result/${row.studentId}/${row.id}`)}
          className="p-2 bg-blue-900 text-white rounded hover:bg-blue-700 transition"
        >
          <View size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">JAM Round Results</h1>

        <div className="flex gap-4 mb-6 bg-white p-4 rounded shadow-sm">
          <input
            type="text"
            placeholder="Search Student ID..."
            value={studentIdSearch}
            onChange={(e) => setStudentIdSearch(e.target.value)}
            className="border p-2 rounded w-64 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Search College..."
            value={collegeNameSearch}
            onChange={(e) => setCollegeNameSearch(e.target.value)}
            className="border p-2 rounded w-64 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded shadow">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            progressPending={loading}
            highlightOnHover
            responsive
          />
        </div>
      </div>
    </div>
  );
}

export default JamResultPage;