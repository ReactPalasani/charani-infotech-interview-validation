"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Header from "@/components/Header";

function HrPortal() {
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/users'); // Your API route
        const data = await res.json();

        if (data.success) {
          // Flatten nested Firebase data structure
          const flattened = Object.values(data.data).flatMap((collegeObj) =>
            Object.values(collegeObj)
          );
          setStudentData(flattened);
        } else {
          alert("No users found");
        }
      } catch (error) {
        console.error(error);
        alert("Error fetching users");
      }
    };

    fetchStudents();
  }, []);

  // Define columns for DataTable
  const columns = [
    { name: "Name", selector: row => row.name, sortable: true },
    { name: "Email", selector: row => row.email, sortable: true },
    { name: "College ID", selector: row => row.collegeId, sortable: true },
    { name: "College Name", selector: row => row.collegeName, sortable: true },
    { name: "Branch", selector: row => row.branch, sortable: true },
    { name: "Year", selector: row => row.year, sortable: true },
    { name: "Gender", selector: row => row.gender, sortable: true },
    { name: "Phone", selector: row => row.phone, sortable: true },
    { name: "Backlogs", selector: row => row.backLogs, sortable: true },
  ];

  return (
    <div className="p-6">
        <Header/>
      <h1 className="text-2xl font-bold mb-4 ">HR Portal - Student Records</h1>
      <DataTable
        columns={columns}
        data={studentData}
        pagination
        highlightOnHover
        striped
        responsive
      />
    </div>
  );
}

export default HrPortal;
