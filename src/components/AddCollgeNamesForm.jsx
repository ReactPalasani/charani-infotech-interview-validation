"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Building2 } from "lucide-react";
import * as Yup from "yup";

export default function AddCollegeNameForm() {
  const [collegeList, setCollegeList] = useState([]);
  const [response, setResponse] = useState("");

  /* =========================
     Fetch active colleges (GET)
  ========================= */
  useEffect(() => {
    const fetchColleges = async () => {
      const res = await fetch("/api/add-colleges");
      const data = await res.json();
      if (data.success) setCollegeList(data.data);
    };
    fetchColleges();
  }, []);

  /* =========================
     Formik
  ========================= */
  const formik = useFormik({
    initialValues: {
      collegeName: "",
      status: "",
    },
    validationSchema: Yup.object({
      collegeName: Yup.string().required("College name is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await fetch("/api/add-colleges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (!data.success) {
          setResponse(
            <p className="text-red-600 font-medium mt-2">{data.message}</p>
          );
          return;
        }

        setResponse(
          <p className="text-green-700 font-semibold mt-2 text-center">
            College added successfully!
          </p>
        );

        resetForm();
      } catch {
        setResponse(
          <p className="text-red-600 font-medium mt-2 text-center">
            Something went wrong!
          </p>
        );
      } finally {
        setTimeout(() => setResponse(""), 2000);
      }
    },
  });

  return (
    <div className="w-4/5">
      <div className="bg-white rounded-2xl shadow-xl border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="w-6 h-6 text-blue-900" />
          <h2 className="text-xl font-bold text-gray-900">
            Add College Name
          </h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* College Name */}
          <div>
            <input
              name="collegeName"
              type="text"
              list="college-list"
              value={formik.values.collegeName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Search or add college..."
              className="w-full px-4 py-3 border rounded-lg"
            />

            <datalist id="college-list">
              {collegeList.map((college, idx) => (
                <option key={idx} value={college.collegeName} />
              ))}
            </datalist>

            {formik.touched.collegeName && formik.errors.collegeName && (
              <p className="text-sm text-red-600 mt-1">
                {formik.errors.collegeName}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {formik.touched.status && formik.errors.status && (
              <p className="text-red-500 text-sm">
                {formik.errors.status}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold"
          >
            Submit
          </button>

          {response}
        </form>
      </div>
    </div>
  );
}
