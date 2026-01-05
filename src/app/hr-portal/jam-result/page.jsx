"use client";

import { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import Header from "@/components/Header";
import { View, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

function HrPortal_Exam() {
  const [studentData, setStudentData] = useState([]);
  const [studentIdSearch, setstudentIdSearch] = useState("");
  const [correctAnswersSearch, setCorrectAnswersSearch] = useState("");
  const [selectSearch, setSelectSearch] = useState("");
  const router = useRouter();
  const [collegeNameSearch, setCollegeNameSearch] = useState("");
  const[response,setResponse]=useState();


   useEffect(
  ()=>{
     const admin=  JSON.parse( localStorage.getItem('AdminLogin'));
     if(!admin){
      router.push('/admin');
     }
  },[]
 );

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/jam-result");
        const data = await res.json();

        if (data.success) {
          // ✅ CORRECT flattening
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
           setResponse(<div className='flex justify-center align-middle text-center text-red-800 font-bold mt-6'> Error fetching users</div>);
      }
    };

    fetchStudents();
  }, []);

  // 🔍 Filtering
const filteredData = useMemo(() => {
  return studentData.filter(student => {
    const matchStudentId = studentIdSearch
      ? student.studentId
          ?.toLowerCase()
          .includes(studentIdSearch.toLowerCase())
      : true;

    const matchCollegeName = collegeNameSearch
      ? student.collegeName
          ?.toLowerCase()
          .includes(collegeNameSearch.toLowerCase())
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

    return (
      matchStudentId &&
      matchCollegeName &&
      matchCorrectAnswers &&
      matchSelect
    );
  });
}, [
  studentData,
  studentIdSearch,
  collegeNameSearch,
  correctAnswersSearch,
  selectSearch,
]);

/* ================= EXCEL DOWNLOAD (DYNAMIC) ================= */
  const downloadExcel = () => {
    if (!filteredData.length) return;

    const excelData = filteredData.map((row, index) => {
      const formattedRow = { "S.No": index + 1 };

      Object.entries(row).forEach(([key, value]) => {
        if (key !== "id") {
          formattedRow[key] = value;
        }
      });

      return formattedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Jam Results"
    );

    XLSX.writeFile(workbook, "Jam_Results.xlsx");
  };


  // 📊 Columns
  const columns = [
      {
    name: "S.No",
    cell: (row, index) => index + 1,
    width: "80px",
  },
    { name: "Name", selector: row => row.studentName, sortable: true },
    { name: "Email", selector: row => row.studentEmail, sortable: true, width:"250px"
    },
    { name: "Student ID", selector: row => row.studentId, sortable: true },
    { name: "College Name", selector: row => row.collegeName, sortable: true,  width : "250px" },
    { name: "Total Questions", selector: row => row.totalQuestions, sortable: true },
    { name: "Correct Answers", selector: row => row.correctAnswers, sortable: true },
    { name: "Score", selector: row => row.score, sortable: true },
    { name: "Topic", selector: row => row.topic, sortable: true },
    { name: "Select", selector: row => row.select === true ? "Yes" : "NO", sortable: true },
    { name: "Selector Name", selector: row => row.selectorName, sortable: true },
    {
      name: "Action",
      cell: row => (
        <button
          onClick={() =>
            router.push(`/tr1-portal/${row.studentId}/${row.id}`)
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
       Jam Result
      </h1>

      {/* Filters */}
    <div className="flex gap-4 mb-4 flex-wrap">

        <input
    type="text"
    placeholder="Search by College Name"
    value={collegeNameSearch}
    autoFocus
    onChange={e => setCollegeNameSearch(e.target.value)}
    className="border px-3 py-2 rounded w-64"
  />

  <input
    type="text"
    placeholder="Search by Student ID"
    value={studentIdSearch}
    
    onChange={e => setstudentIdSearch(e.target.value)}
    className="border px-3 py-2 rounded w-64"
  />



  {/* <input
    type="number"
    placeholder="Search by Correct Answers"
    value={correctAnswersSearch}
    onChange={e => setCorrectAnswersSearch(e.target.value)}
    className="border px-3 py-2 rounded w-64"
  /> */}

  <div className="grid">
    <label className="font-bold">Select Or Not</label>
    <select
      value={selectSearch}
      onChange={e => setSelectSearch(e.target.value)}
      className="border px-3 py-2 rounded w-64"
    >
      <option value="">All</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </select>
  </div>
  <button
            onClick={downloadExcel}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            <Download size={18} />
            Download Excel
          </button>

</div>


      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        responsive 
        style={{minWidth:'250px'}}
      />
      {response}
    </div>
  );
}

export default HrPortal_Exam;
