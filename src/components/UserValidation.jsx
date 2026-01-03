"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "./Header";
import { useEffect } from "react";

function UserValidation() {
    const validationSchema = Yup.object({
        collegeId: Yup.string()
            .required("College ID is required")
            .min(10, "Minimum 10 characters")
            .max(12, "Maximum 12 characters"),
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
    });
    useEffect( async() => {
        try {
                const res = await fetch('/api/users', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });


                const data = await res.json();
                if (data.success) {
                    localStorage.setItem('StudentData', JSON.stringify(values));
                    router.push("/instructions");
                } else {
                    alert('User Already Exist');
                }
            } catch (error) {
                console.error(error);
                alert('User Already Exist');
            }
    },[])
    const formik = useFormik({
        initialValues: {
            collegeId: "",
            email: "",
        },
        validationSchema,
        onSubmit: async (values) => {

        },
    });

    return (
        <>
            <Header />
            <div className="bg-gray-100 min-h-screen flex justify-center items-center">
                <div className="bg-white p-8 rounded shadow-md w-1/2">
                    <h1 className="text-2xl font-bold mb-6 text-center">Technical Round Validation</h1>
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="collegeId" className="font-semibold">Roll-No</label>
                            <input
                                id="collegeId"
                                name="collegeId"
                                type="text"
                                maxLength={12}
                                minLength={10}
                                placeholder="Enter Your Roll No"
                                value={formik.values.collegeId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`p-2 border rounded outline-none ${formik.touched.collegeId && formik.errors.collegeId ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {formik.touched.collegeId && formik.errors.collegeId && (
                                <div className="text-red-600 text-sm">{formik.errors.collegeId}</div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="font-semibold">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter Your Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`p-2 border rounded outline-none ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-600 text-sm">{formik.errors.email}</div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-900 text-white py-2 rounded font-bold mt-4 hover:bg-blue-800 transition"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default UserValidation;
