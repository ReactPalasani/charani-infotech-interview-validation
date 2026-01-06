"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "./Header";
import { useRouter } from "next/navigation";
import { useState } from "react";

function UserValidation() {
  const router = useRouter();
  const [responce, setResponse] = useState();
  const validationSchema = Yup.object({
    studentId: Yup.string()
      .required("College ID is required")
      .min(10, "Minimum 10 characters")
      .max(12, "Maximum 12 characters"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      studentId: "",
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {

      const res = await fetch("/api/validation-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: values.studentId,
          email: values.email,
        }),
      });

      const data = await res.json();


      if (data.success) {
        localStorage.setItem("StudentData", JSON.stringify(data.data));
        setResponse(<div className='flex justify-center align-middle text-center text-green-800 font-bold mt-6'> ✅ Allowed to attend Technical Round</div>);
        setTimeout(() => {
          router.push("/technical-round-1");
          setResponse("");
        }, 2000);

      } else {
        setResponse(<div className='flex justify-center align-middle text-center text-red-800 font-bold mt-6'> ❌ {data.message} </div>);

        setTimeout(() => {
          setResponse("");
        }, 2000);
      }

    },
  });

  return (
    <>
      <Header />
      <div className="bg-blue-900 min-h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded shadow-md w-1/2">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Technical Round Validation
          </h1>

          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            {/* Roll No */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Roll-No</label>
              <input
                name="studentId"
                type="text"
                maxLength={12}
                placeholder="Enter Your Roll No"
                {...formik.getFieldProps("studentId")}
                className={`p-2 border rounded ${formik.touched.studentId && formik.errors.studentId
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
              />
              {formik.touched.studentId && formik.errors.studentId && (
                <p className="text-red-600 text-sm">
                  {formik.errors.studentId}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Enter Your Email"
                {...formik.getFieldProps("email")}
                className={`p-2 border rounded ${formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-600 text-sm">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-blue-900 text-white py-2 rounded font-bold mt-4 hover:bg-blue-800 disabled:opacity-50"
            >
              {formik.isSubmitting ? "Validating..." : "Submit"}
            </button>
          </form>
          {responce}
        </div>
      </div>
    </>
  );
}

export default UserValidation;
