"use client";

import { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { View, MessagesSquare, X, UserCheck, NotepadText } from "lucide-react";
import { useRouter } from "next/navigation";

function HrPortal_Exam() {
  const [studentData, setStudentData] = useState([]);
  const [studentIdSearch, setstudentIdSearch] = useState("");
  const [selectSearch, setSelectSearch] = useState("");
  const [collegeNameSearch, setCollegeNameSearch] = useState("");
  const [response, setResponse] = useState(null);
  const router = useRouter();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Form State for Popup
  const [feedback, setFeedback] = useState("");
  const [topic, setTopic] = useState(""); 
  const [selectorName, setSelectorName] = useState("");
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('AdminLogin'));
    if (!admin) {
      router.push('/admin');
    }
  }, [router]);

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

  const filteredData = useMemo(() => {
    return studentData.filter(student => {
      const matchStudentId = studentIdSearch ? student.studentId?.toLowerCase().includes(studentIdSearch.toLowerCase()) : true;
      const matchCollegeName = collegeNameSearch ? student.collegeName?.toLowerCase().includes(collegeNameSearch.toLowerCase()) : true;
      const matchSelect = selectSearch === "" ? true : selectSearch === "yes" ? student.select === true : student.select === false;
      return matchStudentId && matchCollegeName && matchSelect;
    });
  }, [studentData, studentIdSearch, collegeNameSearch, selectSearch]);

  const handleOpenModal = (student) => {
    setSelectedStudent(student);
    setFeedback("");
    setTopic(""); 
    setSelectorName("");
    setIsSelected(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      studentName: selectedStudent.studentName,
      studentEmail: selectedStudent.studentEmail,
      studentId: selectedStudent.studentId,
      collegeName: selectedStudent.collegeName,
      totalQuestions: selectedStudent.totalQuestions,
      correctAnswers: selectedStudent.correctAnswers,
      submittedAt: selectedStudent.submittedAt,
      feedback,
      topic,
      selectorName,
      select: isSelected
    };

    try {
      const res = await fetch("/api/tr1-Exam-Result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("Data submitted successfully!");
        setIsModalOpen(false);
        fetchStudents(); 
      } else {
        alert("User already exists.");
      }
    } catch (error) {
      alert("Error submitting data.");
    }
  };

  const columns = [
    { name: "S.No", cell: (row, index) => index + 1, width: "80px" },
    { name: "Name", selector: row => row.studentName, sortable: true },
    { name: "Email", selector: row => row.studentEmail, sortable: true, width: "220px" },
    { name: "Student ID", selector: row => row.studentId, sortable: true },
    { name: "College", selector: row => row.collegeName, sortable: true, width: "250px" },
    { name: "Score", selector: row => row.score, sortable: true },
    { name: "Select", selector: row => row.select ? "Yes" : "No", sortable: true },
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Jam Result Portal</h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search by College Name"
          value={collegeNameSearch}
          onChange={e => setCollegeNameSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-64 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="text"
          placeholder="Search by Student ID"
          value={studentIdSearch}
          onChange={e => setstudentIdSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-64 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <select
          value={selectSearch}
          onChange={e => setSelectSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-64 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white"
        >
          <option value="">All Status</option>
          <option value="yes">Selected (Yes)</option>
          <option value="no">Not Selected (No)</option>
        </select>
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
              
              {/* Left Column: Details + Topic */}
              <div className="space-y-6">
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2 uppercase text-xs tracking-wider">Student Details</h3>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <span className="text-gray-600 font-medium">Full Name:</span> <span className="text-gray-900">{selectedStudent.studentName}</span>
                    <span className="text-gray-600 font-medium">Email:</span> <span className="text-gray-900 break-all">{selectedStudent.studentEmail}</span>
                    <span className="text-gray-600 font-medium">College:</span> <span className="text-gray-900">{selectedStudent.collegeName}</span>
                    <span className="text-gray-600 font-medium">Total Qs:</span> <span className="text-gray-900">{selectedStudent.totalQuestions}</span>
                    <span className="text-gray-600 font-medium">Correct Ans:</span> <span className="text-gray-900 font-bold text-green-700">{selectedStudent.correctAnswers}</span>
                    <span className="text-gray-600 font-medium">Date:</span> <span className="text-gray-900">{selectedStudent.submittedAt}</span>
                  </div>
                </div>

                {/* Topic placed below the details */}
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

              {/* Right Column: Invigilator & Feedback */}
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

export default HrPortal_Exam;