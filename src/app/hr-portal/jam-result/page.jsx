"use client";

import { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import Header from "@/components/Header";
import { View } from "lucide-react";
import { useRouter } from "next/navigation";

function HrPortal_Exam() {
  const [studentData, setStudentData] = useState([]);
  const [collegeIdSearch, setCollegeIdSearch] = useState("");
  const [correctAnswersSearch, setCorrectAnswersSearch] = useState("");
  const [selectSearch, setSelectSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/jam-result");
        const data = await res.json();

        if (data.success) {
          // ✅ CORRECT flattening
          const flattened = Object.entries(data.data || {}).flatMap(
            ([collegeId, collegeObj]) =>
              Object.entries(collegeObj).map(([resultId, value]) => ({
                id: resultId,
                collegeId,
                ...value,
              }))
          );

          setStudentData(flattened);
        }
      } catch (error) {

        alert("Error fetching users");
      }
    };

    fetchStudents();
  }, []);

  // 🔍 Filtering
  const filteredData = useMemo(() => {
    return studentData.filter(student => {
      const matchCollegeId = collegeIdSearch
        ? student.collegeId
          ?.toLowerCase()
          .includes(collegeIdSearch.toLowerCase())
        : true;

      const matchCorrectAnswers = correctAnswersSearch
        ? Number(student.correctAnswers) === Number(correctAnswersSearch)
        : true;

      const matchSelect =
        selectSearch === ""
          ? true
          : selectSearch === "yes"
            ? student.select === true
            : student.select === false;

      return matchCollegeId && matchCorrectAnswers && matchSelect;
    });
  }, [studentData, collegeIdSearch, correctAnswersSearch, selectSearch]);


  // 📊 Columns
  const columns = [
    { name: "Name", selector: row => row.studentName, sortable: true },
    { name: "Email", selector: row => row.studentEmail, sortable: true },
    { name: "College ID", selector: row => row.collegeId, sortable: true },
    { name: "College Name", selector: row => row.collegeName, sortable: true },
    { name: "Total Questions", selector: row => row.totalQuestions, sortable: true },
    { name: "Correct Answers", selector: row => row.correctAnswers, sortable: true },
    { name: "Submitted At", selector: row => row.submittedAt, sortable: true },
    { name: "Submitted At", selector: row => row.submittedAt, sortable: true },
    { name: "Score", selector: row => row.score, sortable: true },
    { name: "Topic", selector: row => row.topic, sortable: true },
    { name: "Select", selector: row => row.select === true ? "Yes" : "NO", sortable: true },
    { name: "Selector Name", selector: row => row.selectorName, sortable: true },
    {
      name: "Action",
      cell: row => (
        <button
          onClick={() =>
            router.push(`/tr1-portal/${row.collegeId}/${row.id}`)
          }
          className="bg-blue-900 text-white px-3 py-1 rounded text-sm"
        >
          <View size={16} />
        </button>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        HR Portal - Student Records
      </h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by College ID"
          value={collegeIdSearch}
          onChange={e => setCollegeIdSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        <input
          type="number"
          placeholder="Search by Correct Answers"
          value={correctAnswersSearch}
          onChange={e => setCorrectAnswersSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
        <div className="grid">
          <label htmlFor="" className="font-bold">Select Or not</label>
          <select
            value={selectSearch}
            onChange={e => setSelectSearch(e.target.value)}
            className="border px-3 py-2 rounded w-64"
          >
            <option value="">All (Select)</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        responsive
      />
    </div>
  );
}

export default HrPortal_Exam;
