"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "./Header";
import { useRouter } from "next/navigation";

function UserValidation() {
  const router = useRouter();

  const validationSchema = Yup.object({
    collegeId: Yup.string()
      .required("College ID is required")
      .min(10, "Minimum 10 characters")
      .max(12, "Maximum 12 characters"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      collegeId: "",
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("enterd");
      const res = await fetch("/api/validation-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collegeId: values.collegeId,
          email: values.email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Allowed to attend Technical Round");
        router.push("/technical-round-1");
      } else {
        alert("❌ " + data.message);
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
                name="collegeId"
                type="text"
                maxLength={12}
                placeholder="Enter Your Roll No"
                {...formik.getFieldProps("collegeId")}
                className={`p-2 border rounded ${formik.touched.collegeId && formik.errors.collegeId
                    ? "border-red-500"
                    : "border-gray-300"
                  }`}
              />
              {formik.touched.collegeId && formik.errors.collegeId && (
                <p className="text-red-600 text-sm">
                  {formik.errors.collegeId}
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
        </div>
      </div>
    </>
  );
}

export default UserValidation;
