"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

function CollegesNamesList() {
  const [collegeList, setCollegeList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // Fetch colleges
  useEffect(() => {
    const fetchColleges = async () => {
      const res = await fetch("/api/add-colleges");
      const data = await res.json();
      if (data.success) setCollegeList(data.data);
    };
    fetchColleges();
  }, []);

  // Toggle status
  const toggleStatus = async (row) => {
    const updatedStatus = row.status === "active" ? "inactive" : "active";

    // Update UI immediately
    setCollegeList((prev) =>
      prev.map((c) =>
        c.id === row.id ? { ...c, status: updatedStatus } : c
      )
    );

    // Update backend
    await fetch("/api/add-colleges", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: row.id,
        status: updatedStatus,
      }),
    });
  };

  const handleCheckboxChange = (row) => {
    setSelectedRows((prev) =>
      prev.find((s) => s.id === row.id)
        ? prev.filter((s) => s.id !== row.id)
        : [...prev, row]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === collegeList.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(collegeList);
    }
  };

  // Columns
  const columns = [
    { name: "S.No", cell: (row, index) => index + 1, width: "60px" },

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

    {
      name: (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={
              selectedRows.length === collegeList.length &&
              collegeList.length > 0
            }
          />
          <span>Select</span>
        </div>
      ),
      width: "110px",
      cell: (row) => (
        <input
          type="checkbox"
          className="w-5 h-5 cursor-pointer accent-blue-600"
          checked={!!selectedRows.find((s) => s.id === row.id)}
          onChange={() => handleCheckboxChange(row)}
        />
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
