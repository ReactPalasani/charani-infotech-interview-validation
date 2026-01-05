"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Building2 } from "lucide-react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

export default function AddCollegeNameForm() {
    const router = useRouter();
    const [collegeList, setCollegeList] = useState([]);
    const [response, setResponse] = useState("");

    /* =========================
       Fetch colleges (GET)
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
        initialValues: { collegeName: "" },
        validationSchema: Yup.object({
            collegeName: Yup.string().required("College name is required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const res = await fetch("/api/add-colleges", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ collegeName: values.collegeName }),
                });

                const data = await res.json();

                if (!data.success) {
                    setResponse(
                        <p className="text-red-600 font-medium mt-2">
                            {data.message}
                        </p>
                    );
                    return;
                }

                setResponse(
                    <p className="text-green-700 font-semibold mt-2 flex justify-center items-center">
                        College Name added successfully!
                    </p>
                );

                resetForm();
            } catch {
                setResponse(
                    <p className="text-red-600 font-medium mt-2  flex justify-center items-center">
                        Something went wrong!
                    </p>
                );
            }
            finally{
                setTimeout(() => {
                    setResponse("")
                }, 2000);
            }
        },
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-1/2 max-w-lg bg-white rounded-2xl shadow-xl border p-6">

                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <Building2 className="w-6 h-6 text-blue-900" />
                    <h2 className="text-xl font-bold text-gray-900">
                        Add College Name
                    </h2>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    {/* Input */}
                    <div>
                        <input
                            name="collegeName"
                            type="text"
                            list="college-list"
                            value={formik.values.collegeName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Search or add college..."
                            className=" w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-700 outline-none transition"
                        />

                        <datalist id="college-list">
                            {collegeList.map((college, idx) => (
                                <option key={idx} value={college} />
                            ))}
                        </datalist>

                        {formik.touched.collegeName && formik.errors.collegeName && (
                            <p className="text-sm text-red-600 mt-1">
                                {formik.errors.collegeName}
                            </p>
                        )}
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                    >
                        Submit
                    </button>

                    {response}
                </form>
            </div>
        </div>
    );
}
