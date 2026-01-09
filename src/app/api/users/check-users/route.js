import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, set, get } from "firebase/database";

// POST → Save student data
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.studentId) {
      return NextResponse.json(
        { success: false, message: "studentId is required" },
        { status: 400 }
      );
    }

    const studentRef = ref(database, `users/${body.studentId}`);
    const snapshot = await get(studentRef);

    // ✅ Check if student already exists
    if (snapshot.exists()) {
      return NextResponse.json(
        { success: false, message: "Student already registered" },
        { status: 409 }
      );
    }
   else{
     return NextResponse.json(
        { success: true, message: "Student not register" },
        { status: 200}
      );

   }

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
