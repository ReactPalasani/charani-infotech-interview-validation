"use client";
import React, { useEffect, useState } from 'react';
import { ShieldCheck, Timer, CheckCircle, User, Mail, Phone, BookOpen, Building2, GraduationCap, History, ArrowRight, Calendar, RotateCcw } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from "next/navigation";
import Footer from '@/components/Footer';
import Header from '@/components/Header';
// import UserService from '@/lib/services';
// import { NextResponse } from 'next/server';
const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    studentId: Yup.string().required('Student ID is required')
        .max(12, 'Maximum 12 letters')
        .min(10, 'Enter minimum 10 letters'),
    phone: Yup.string()
        .matches(/^[6-9][0-9]{9}$/, 'Phone number must start with 6, 7, 8, or 9 and be 10 digits')
        .required('Phone number is required'),
    collegeName: Yup.string().required('College Name is required'),
    gender: Yup.string().required('Gender is required').oneOf(['male', 'female', 'other'], 'Please select a valid gender'),
    branch: Yup.string().required('Branch is required'),
    year: Yup.string().required('Year is required'),
    backLogs: Yup.number().min(0, 'Cannot be negative').required('Required'),
    dataOfBirth: Yup.date()
        .nullable() 
        .required("Date of birth is required")
        .max(new Date(), "Date cannot be in the future"),

});

export default function ExamPage() {

    const [responce, setResponse] = useState();
    const [studentResponse, setStudentResponse] = useState("");
    const router = useRouter();
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            studentId: "",
            collegeName: "",
            gender: "",
            branch: "",
            year: "",
            backLogs: 0,
            dataOfBirth: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const res = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });


                const data = await res.json();
                if (data.success) {
                    setResponse(<div className='flex justify-center align-middle text-center text-green-800 font-bold'>{data.message} </div>);
                    localStorage.setItem('StudentData', JSON.stringify(values));

                    router.push("/instructions");

                } else {
                    setResponse(<div className='flex justify-center align-middle text-center text-red-500 font-bold'> Student-Id Already Exists </div>);
                }
            } catch (error) {
                setResponse(<div className='flex justify-center align-middle text-center text-red-500 font-bold mt-5'> Student-Id Already Exists </div>);

            }
            finally {
                setTimeout(() => {
                    setResponse("");
                }, 2000);
            }
        }
    });

    const [collegeList, setCollegeList] = useState();
    useEffect(() => {
        const fetchColleges = async () => {
            const res = await fetch("/api/add-colleges");
            const data = await res.json();
            if (data.success) setCollegeList(data.data);
        };
        fetchColleges();
    }, []);

    useEffect(() => {
        localStorage.clear();
    }, [])

    useEffect(() => {
        if (!formik.values.studentId || formik.values.studentId.length < 10) return;

        const timer = setTimeout(async () => {
            try {
                const res = await fetch("/api/users/check-users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId: formik.values.studentId }),
                });

                const data = await res.json();

                if (!data.success) {
                    setStudentResponse(
                        <div className="text-red-600 text-sm font-bold">
                            Student ID already exists
                        </div>
                    );
                } else {
                    setStudentResponse("");
                }
            } catch (err) {
                console.error(err);
            }
            // finally{
            //     setTimeout(() => {
            //             setStudentResponse("")
            //     }, 1000);

            // }
        }, 300); // debounce delay

        return () => clearTimeout(timer);
    }, [formik.values.studentId]);



    return (
        <>
        <Header/>
            <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 font-sans text-black">
                <div className="flex flex-col md:flex-row w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden bg-white">

                    {/* Left Side */}
                    <div className="flex-1 bg-blue-900 p-8 text-white flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-4 mb-5">
                                <img src="/charani-logo.jpeg" alt="Logo" className="w-16 h-16 rounded-full border-2 border-white object-cover" />
                                <h1 className="text-2xl font-bold tracking-tight">Charani Infotech</h1>
                            </div>
                            <h2 className="text-4xl font-bold mb-6 leading-tight">Feature Ready <br /> Assessments</h2>
                            <ul className="space-y-4 mb-5">
                                <li className="flex items-center gap-3"><CheckCircle className="text-green-400 w-5 h-5" /> Instant evaluation</li>
                                <li className="flex items-center gap-3"><CheckCircle className="text-green-400 w-5 h-5" /> Secure environment</li>
                                <li className="flex items-center gap-3"><CheckCircle className="text-green-400 w-5 h-5" /> Comprehensive analytics</li>
                            </ul>
                        </div>
                        <div className="space-y-6 border-t border-blue-800 pt-4">
                            <div className="flex items-center gap-4"><ShieldCheck className="w-8 h-8 text-green-400" /><h3 className="font-semibold text-lg">Secure & Protected</h3></div>
                            <div className="flex items-center gap-4"><Timer className="w-8 h-8 text-amber-400" /><h3 className="font-semibold text-lg">Real-time Analytics</h3></div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="flex-[1.5] bg-white p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
                            <div>
                                <h1 className="text-3xl font-extrabold text-blue-900">Student Registration</h1>
                                <p className="text-gray-500 mt-2">Please enter your details to continue.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-bold text-blue-900 flex items-center gap-2"><User className="w-4 h-4" /> Name <span className='text-red-600'>*</span></label>
                                    <input id="name" name="name" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} placeholder='Enter your full name' autoFocus
                                        className={`p-2 border rounded-lg outline-none transition-all ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300 focus:border-blue-900'}`} />
                                    {formik.touched.name && formik.errors.name && <div className='text-red-600 text-xs'>{formik.errors.name}</div>}
                                </div>
                                {/* Email */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-bold text-blue-900 flex items-center gap-2"><Mail className="w-4 h-4" /> Email <span className='text-red-600'>*</span></label>
                                    <input id="email" name="email" type="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} placeholder='Enter your valid email'
                                        className={`p-2 border rounded-lg outline-none transition-all ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-900'}`} />
                                    {formik.touched.email && formik.errors.email && <div className='text-red-600 text-xs'>{formik.errors.email}</div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Phone */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-bold text-blue-900 flex items-center gap-2"><Phone className="w-4 h-4" /> Phone <span className='text-red-600'>*</span></label>
                                    <input id="phone" name="phone" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phone} maxLength={10} placeholder='Enter your valid contact number'
                                        className="p-2 border border-gray-300 rounded-lg focus:border-blue-900 outline-none" />
                                    {formik.touched.phone && formik.errors.phone && <div className='text-red-600 text-xs'>{formik.errors.phone}</div>}
                                </div>
                                {/* Student ID */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-bold text-blue-900 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Student-Id <span className='text-red-600'>*</span></label>
                                    <input id="studentId" name="studentId" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.studentId} placeholder='Enter your student id' minLength={10} maxLength={12}
                                        className="p-2 border border-gray-300 rounded-lg focus:border-blue-900 outline-none" />
                                    {formik.touched.studentId && formik.errors.studentId && <div className='text-red-600 text-xs'>{formik.errors.studentId}</div>}
                                    {studentResponse}
                                </div>
                            </div>

                            {/* College Name */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-bold text-blue-900 flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    College Name <span className="text-red-600">*</span>
                                </label>

                                <select
                                    name="collegeName"
                                    value={formik.values.collegeName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`p-2 border rounded-lg outline-none transition-all
                                 ${formik.touched.collegeName && formik.errors.collegeName
                                            ? "border-red-500"
                                            : "border-gray-300 focus:border-blue-900"
                                        }`}
                                >
                                    <option value="">Select College</option>

                                    {collegeList?.map((college, index) => (
                                        <option key={index} value={college.collegeName}>
                                            {college.collegeName}
                                        </option>
                                    ))}
                                </select>

                                {formik.touched.collegeName && formik.errors.collegeName && (
                                    <div className="text-red-600 text-xs">
                                        {formik.errors.collegeName}
                                    </div>
                                )}
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Gender */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-bold text-blue-900 flex items-center gap-2"> <User className="w-4 h-4" /> Gender <span className='text-red-600'>*</span></label>
                                    <select name="gender" onChange={formik.handleChange} value={formik.values.gender} className="p-2 border border-gray-300 rounded-lg outline-none">
                                        <option value=''>select Gender</option>
                                        <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                                    </select>
                                    {formik.touched.gender && formik.errors.gender && <div className='text-red-600 text-xs'>{formik.errors.gender}</div>}
                                </div>
                                {/* Branch */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-bold text-blue-900 flex items-center gap-2"><GraduationCap className="w-4 h-4" />Branch <span className='text-red-600'>*</span></label>
                                    <select name="branch" onChange={formik.handleChange} value={formik.values.branch} className="p-2 border border-gray-300 rounded-lg outline-none">
                                        <option>select Branch</option>
                                        <option value="aiml">AI/ML</option><option value="cse">CSE</option><option value="civil">CIVIL</option><option value="ece">ECE</option><option value="mech">Mech</option><option value="eee">EEE</option><option value="it">IT</option>
                                    </select>
                                    {formik.touched.branch && formik.errors.branch && <div className='text-red-600 text-xs'>{formik.errors.branch}</div>}
                                </div>
                                {/* Year */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-bold text-blue-900 flex items-center gap-2"><Calendar className="w-4 h-4" /> Year <span className='text-red-600'>*</span></label>
                                    <select name="year" onChange={formik.handleChange} value={formik.values.year} className="p-2 border border-gray-300 rounded-lg outline-none">
                                        <option >select Year</option>
                                        <option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option>
                                    </select>
                                    {formik.touched.year && formik.errors.year && <div className='text-red-600 text-xs'>{formik.errors.year}</div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Backlogs */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-bold text-blue-900 flex items-center gap-2"><History className="w-4 h-4" /> Backlogs <span className='text-red-600'>*</span></label>
                                    <input id="backLogs" name="backLogs" type="number" onChange={formik.handleChange} value={formik.values.backLogs}
                                        className="p-2 border border-gray-300 rounded-lg focus:border-blue-900 outline-none" />
                                    {formik.touched.backLogs && formik.errors.backLogs && <div className='text-red-600 text-xs'>{formik.errors.backLogs}</div>}
                                </div>

                                {/* Data of birth */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-bold text-blue-900 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date of birth <span className='text-red-600'>*</span></label>
                                    <input id="dataOfBirth" name="dataOfBirth" type="date" onChange={formik.handleChange} value={formik.values.dataOfBirth}
                                        className="p-2 border border-gray-300 rounded-lg focus:border-blue-900 outline-none" />
                                    {formik.touched.dataOfBirth && formik.errors.dataOfBirth && <div className='text-red-600 text-xs'>{formik.errors.dataOfBirth}</div>}
                                </div>
                            </div>

                            {/* Buttons Container */}
                            <div className="flex justify-between items-center w-full mt-4">
                                <button type="button" onClick={formik.handleReset}
                                    className="bg-gray-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-700 transition-all shadow-md active:scale-95">
                                    <RotateCcw className="w-5 h-5" /> Reset
                                </button>

                                <button type="submit"
                                    className="bg-blue-900 text-white px-8 py-2 rounded-lg font-bold flex items-center gap-3 hover:bg-blue-800 transition-all shadow-md active:scale-95">
                                    Complete Registration <ArrowRight className="w-6 h-6" />
                                </button>
                            </div>
                        </form>
                        {responce}
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}