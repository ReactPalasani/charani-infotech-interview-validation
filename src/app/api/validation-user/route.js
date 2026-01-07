import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin"; // ✅ Use Admin SDK

export async function POST(req) {
  try {
    const { studentId, email } = await req.json();

    if (!studentId || !email) {
      return NextResponse.json(
        { success: false, message: "studentId and email required" },
        { status: 400 }
      );
    }
     
      const snapshot1 = await db.ref(`Technical-1-Results/${studentId}`).once("value");

      if (snapshot1.exists()) {
      return NextResponse.json({
        success: false,
        message: "Data Already Exist",
      });
    }

    // 🔹 Fetch college data
    const snapshot = await db.ref(`Tr1Result/${studentId}`).once("value");


    if (!snapshot.exists()) {

      return NextResponse.json({
        success: false,
        message: "College ID not found",
      });
    }

    let isEligible = false;
    let userData = null;

    snapshot.forEach((child) => {
      const data = child.val();

      if (data.studentEmail === email && ( data.jam_selected === true || select===true || Aptitude_select===true)  ) {
        isEligible = true;
        userData = data;

      }
    });

    if (!isEligible) {

      return NextResponse.json({
        success: false,
        message: "User not eligible or not selected",
      });
    }

    return NextResponse.json({

      success: true,
      message: "User validated successfully",
      data: {
        studentName: userData.studentName,
        collegeName: userData.collegeName,
        selectorName: userData.selectorName,
        studentId : userData.studentId,
        studentEmail:userData.studentEmail
      },
    });
  } catch (error) {

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
