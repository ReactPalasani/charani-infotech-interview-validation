import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin"; // ✅ Use Admin SDK

export async function POST(req) {
  try {
    const { collegeId, email } = await req.json();

    if (!collegeId || !email) {
      return NextResponse.json(
        { success: false, message: "collegeId and email required" },
        { status: 400 }
      );
    }

    // 🔹 Fetch college data
    const snapshot = await db.ref(`Tr1Result/${collegeId}`).once("value");

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
      if (data.studentEmail === email && data.select === true) {
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
      },
    });
  } catch (error) {
    console.error("Validation Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
