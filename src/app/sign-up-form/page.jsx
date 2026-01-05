"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

export default function SignupForm() {
  const router = useRouter();
  const [response, setResponse] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await fetch("/api/admin-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (data.success) {
          setResponse(
            <p className="text-green-600 font-semibold">
              Signup successful 🎉
            </p>
          );
          setTimeout(() => router.push("/admin"), 1500);
        } else {
          setResponse(
            <p className="text-red-600 font-semibold">{data.message}</p>
          );
        }
      } catch (err) {
        setResponse(
          <p className="text-red-600 font-semibold">
            Something went wrong
          </p>
        );
      }
    },
  });

  return (
    <div className="bg-blue-900">
            <Header/>
    <div className="grid justify-center items-center min-h-screen bg-blue-900">

      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-2xl  grid gap-6 space-y-5"
      >
        <h1 className="text-2xl font-bold text-center ">
          Admin Signup
        </h1>

        {/* Name */}
        <div>
          <input
            name="name"
            placeholder="Full Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="w-full p-2 border rounded"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-xs">{formik.errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full p-2 border rounded"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-xs">{formik.errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="w-full p-2 border rounded"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-xs">{formik.errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            className="w-full p-2 border rounded"
          />
          {formik.touched.confirmPassword &&
            formik.errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {formik.errors.confirmPassword}
              </p>
            )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800"
        >
          Create Account
        </button>

        {response}

        <p className="text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-900 cursor-pointer font-semibold"
            onClick={() => router.push("/admin")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
    </div>
  );
}
