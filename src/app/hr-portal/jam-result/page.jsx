"use client";

import { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import Header from "@/components/Header";
import { View, X, NotepadText, UserCheck, MessagesSquare, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

function HrPortal_Exam() {
  const [studentData, setStudentData] = useState([]);
  const [studentIdSearch, setstudentIdSearch] = useState("");
  const [selectSearch, setSelectSearch] = useState("");
  const [collegeNameSearch, setCollegeNameSearch] = useState("");
  const [correctAnswersSearch, setCorrectAnswersSearch] = useState("");
  const [response, setResponse] = useState(null);
  const router = useRouter();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
   const [studentId, setStudentId] = useState(null);

  // Form State for Popup
  const [feedback, setFeedback] = useState("");
  const [topic, setTopic] = useState("");
  const [selectorName, setSelectorName] = useState("");
  const [isSelected, setIsSelected] = useState(false);

  // 1. Auth Check
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('AdminLogin'));
    if (!admin) {
      router.push('/admin');
    }
  }, [router]);

  // 2. Fetch Data
  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/jam-result");
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
      setResponse(<div className='text-red-800 font-bold mt-6 text-center'>Error fetching users</div>);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 3. Modal Logic
  const handleOpenModal = (student) => {
    setStudentId(student)
    setSelectedStudent(student);
    setFeedback("");
    setTopic( "");
    setSelectorName(student.selectorName || "");
    setIsSelected(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...selectedStudent,
        feedback,
        topic,
        selectorName,
        jam_selected: isSelected
      };

      const res = await fetch("/api/tr1-Exam-Result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setResponse(<div className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded shadow-lg z-[60]">Update Successful!</div>);
        setIsModalOpen(false);
        fetchStudents();
        setTimeout(() => setResponse(null), 3000);
      }
    } catch (error) {
      alert("Error updating result");
    }
  };

  // --- EXCEL DOWNLOAD LOGIC ---
  const handleDownloadExcel = () => {
    if (filteredData.length === 0) {
      alert("No data available to download");
      return;
    }

    const excelData = filteredData.map((item, index) => ({
      "S.No": index + 1,
      "Student Name": item.studentName,
      "Email": item.studentEmail,
      "Student ID": item.studentId,
      "College": item.collegeName,
      "Score": item.score,
      "Correct Answers": item.correctAnswers,
      "Selected": item.Aptitude_select? "Yes" : "No",
      "Invigilator": item.selectorName || "N/A",
      "Topic": item.topic || "N/A",
      "Feedback": item.feedback || "N/A",
      "Date": item.submittedAt || "N/A"
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "JAM Results");
    XLSX.writeFile(workbook, `Jam_Results_${new Date().toLocaleDateString()}.xlsx`);
  };

  // 4. Filtering Logic
  const filteredData = useMemo(() => {
    return studentData.filter(student => {
      const matchStudentId = studentIdSearch
        ? student.studentId?.toLowerCase().includes(studentIdSearch.toLowerCase())
        : true;

      const matchCollegeName = collegeNameSearch
        ? student.collegeName?.toLowerCase().includes(collegeNameSearch.toLowerCase())
        : true;

      const matchCorrectAnswers = correctAnswersSearch
        ? Number(student.correctAnswers) === Number(correctAnswersSearch)
        : true;

      const matchSelect =
        selectSearch === ""
          ? true
          : selectSearch === "yes"
            ? student.Aptitude_select === true
            : student.Aptitude_select === false;

      return matchStudentId && matchCollegeName && matchCorrectAnswers && matchSelect;
    });
  }, [studentData, studentIdSearch, collegeNameSearch, correctAnswersSearch, selectSearch]);

  const columns = [
    { name: "S.No", cell: (row, index) => index + 1, width: "80px" },
    { name: "Name", selector: row => row.studentName, sortable: true },
    { name: "Email", selector: row => row.studentEmail, sortable: true, width: "220px" },
    { name: "Student ID", selector: row => row.studentId, sortable: true },
    { name: "College", selector: row => row.collegeName, sortable: true, width: "250px" },
    { name: "Score", selector: row => row.score, sortable: true },
    { name: "Aptitude Select", selector: row => row.Aptitude_select ? "Yes" : "No", sortable: true },
    {
      name: "Action",
      cell: row => (
        <button
          onClick={() => handleOpenModal(row)}
          className="bg-blue-900 text-white px-3 py-1 rounded text-sm hover:bg-blue-800 transition"
        >
          <View size={16} />
        </button>
      ),
      ignoreRowClick: true,
    },

  ];

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1>Selected for Jam</h1>

      {/* Filters & Download Button Row */}
      <div className="flex gap-4 mb-6 flex-wrap items-end">
        <div>
          <label className="block text-sm font-bold mb-1">College Name</label>
          <input
            type="text"
            placeholder="Search College..."
            value={collegeNameSearch}
            onChange={e => setCollegeNameSearch(e.target.value)}
            className="border px-3 py-2 rounded w-64 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Student ID</label>
          <input
            type="text"
            placeholder="Search ID..."
            value={studentIdSearch}
            onChange={e => setstudentIdSearch(e.target.value)}
            className="border px-3 py-2 rounded w-64 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Shortlisted</label>
          <select
            value={selectSearch}
            onChange={e => setSelectSearch(e.target.value)}
            className="border px-3 py-2 rounded w-64 outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {/* Download Button positioned right after Shortlisted input */}
        <button 
          onClick={handleDownloadExcel}
          className="flex items-center justify-center gap-2 bg-green-700 text-white px-6 py-[9px] rounded font-bold hover:bg-green-800 transition shadow-sm"
        >
          <Download size={18} />
          Download Excel
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          responsive
        />
      </div>

      {/* Popup Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            
            <div className="flex justify-between items-center p-5 border-b bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Review Result</h2>
                <p className="text-sm text-gray-500">ID: {selectedStudent.studentId}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2 uppercase text-xs tracking-wider">Student Details</h3>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <span className="text-gray-600 font-medium">Full Name:</span> <span className="text-gray-900">{selectedStudent.studentName}</span>
                    <span className="text-gray-600 font-medium">Email:</span> <span className="text-gray-900 break-all">{selectedStudent.studentEmail}</span>
                    <span className="text-gray-600 font-medium">College:</span> <span className="text-gray-900">{selectedStudent.collegeName}</span>
                    <span className="text-gray-600 font-medium">Correct Ans:</span> <span className="text-gray-900 font-bold text-green-700">{selectedStudent.correctAnswers}</span>
                  </div>
                </div>

                <div>
                   <label className="font-bold flex items-center gap-2 mb-2 text-gray-700">
                     <NotepadText size={18} /> Topic
                   </label>
                   <input
                     type="text"
                     value={topic}
                     onChange={e => setTopic(e.target.value)}
                     className="border-2 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 outline-none border-gray-200"
                     placeholder="Enter Topic Here"
                   />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-bold flex items-center gap-2 mb-2 text-gray-700">
                    <UserCheck size={18} /> Invigilator Name
                  </label>
                  <select
                    value={selectorName}
                    onChange={e => setSelectorName(e.target.value)}
                    className="border-2 rounded-lg p-3 w-full bg-white border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
                  >
                    <option value="">Select Invigilator</option>
                    <option value="raja-sekhar">Raja Sekhar</option>
                    <option value="faruk">Faruk</option>
                    <option value="sathis">Sathis</option>
                    <option value="vanitha">Vanitha</option>
                    <option value="malika">Malika</option>
                    <option value="bindu">Bindu</option>
                    <option value="madhavi">Madhavi</option>
                    <option value="nagendra">Nagendra</option>
                    <option value="mohan-krishna">Mohan Krishna</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold flex items-center gap-2 mb-2 text-gray-700">
                    <MessagesSquare size={18} /> Feedback
                  </label>
                  <textarea
                    rows={6}
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    className="border-2 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-400 outline-none border-gray-200"
                    placeholder="Write performance feedback..."
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    id="modal-select"
                    checked={isSelected}
                    onChange={e => setIsSelected(e.target.checked)}
                    className="w-6 h-6 cursor-pointer accent-blue-900"
                  />
                  <label htmlFor="modal-select" className="font-bold text-gray-700 cursor-pointer select-none">
                    Shortlist for Next Round?
                  </label>
                </div>
              </div>
            </div>

            <div className="p-5 border-t bg-gray-50 flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition"
              >
                Discard
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95"
              >
                Submit & Save Result
              </button>
            </div>
          </div>
        </div>
      )}

      {response}
    </div>
  );
}

// deployment testing comment
export default HrPortal_Exam;