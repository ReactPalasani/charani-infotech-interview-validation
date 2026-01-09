"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

function CollegesNamesList() {
  const [collegeList, setCollegeList] = useState([]);

  useEffect(() => {
    const fetchColleges = async () => {
      const res = await fetch("/api/add-colleges/Admin-Level-GetApi");
      const data = await res.json();
      if (data.success) setCollegeList(data.data);
    };
    fetchColleges();
  }, []);

  const toggleStatus = async (row) => {
    const updatedStatus =
      row.status === "active" ? "inactive" : "active";

    setCollegeList((prev) =>
      prev.map((c) =>
        c.id === row.id ? { ...c, status: updatedStatus } : c
      )
    );

    await fetch("/api/add-colleges", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: row.id,
        status: updatedStatus,
      }),
    });
  };

  const columns = [
    { name: "S.No", cell: (_, i) => i + 1, width: "70px" },
    {
      name: "College Name",
      selector: (row) => row.collegeName,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <button
          onClick={() => toggleStatus(row)}
          className={`px-3 py-1 rounded text-white text-sm ${
            row.status === "active"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          {row.status}
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={collegeList}
      pagination
      highlightOnHover
      striped
      responsive
    />
  );
}

export default CollegesNamesList;
