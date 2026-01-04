"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "./Header";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch("/api/admin-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (data.success) {
          // ✅ Store user data safely
          localStorage.setItem(
            "AdminLogin",
            JSON.stringify(data.data)
          );

          alert("✅ Login successful");
          router.push("/hr-portal");
        } else {
          alert("❌ " + data.message);
        }
      } catch (error) {
        alert("❌ Server error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Header />
      <div className="bg-blue-900 min-h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded shadow-md w-1/2">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Charani Info Tech Login
          </h1>

          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="font-semibold">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...formik.getFieldProps("email")}
                className={`p-2 border rounded w-full ${
                  formik.touched.email && formik.errors.email
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

            {/* Password */}
            <div>
              <label className="font-semibold">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                {...formik.getFieldProps("password")}
                className={`p-2 border rounded w-full ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-600 text-sm">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-blue-900 text-white py-2 rounded font-bold hover:bg-blue-800 disabled:opacity-50"
            >
              {formik.isSubmitting ? "Validating..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
