import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password required" },
        { status: 400 }
      );
    }

    // ✅ Hardcoded admin login (INTERVIEW PURPOSE)
    if (
      email === "hrCharani-infotech@gmail.com" &&
      password === "Ch@r@n!Q1D2@"
    ) {
      return NextResponse.json({
        success: true,
        message: "Successfully Login",
        data: {
          email,
          role: "Admin",
        },
      });
    }

    // ❌ Invalid credentials
    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
