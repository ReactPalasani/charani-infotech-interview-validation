import { getDatabase } from "firebase-admin/database";
import { NextResponse } from "next/server";
import "@/lib/firebaseAdmin"; // make sure admin.initializeApp() is done here

function encodeEmail(email) {
  return email.replace(/\./g, "_");
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password required" },
        { status: 400 }
      );
    }

    const emailKey = encodeEmail(email);
    const db = getDatabase();
    const userRef = db.ref(`AdminUsers/${emailKey}`);

    const snapshot = await userRef.get();

    // ❌ User not found
    if (!snapshot.exists()) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const userData = snapshot.val();

    // ❌ Password mismatch
    if (userData.password !== password) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ Login success
    return NextResponse.json({
      success: true,
      message: "Successfully Login",
      data: {
        email: userData.email,
        role: userData.role || "Admin",
        name: userData.name,
      },
    });

  } catch (error) {

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
