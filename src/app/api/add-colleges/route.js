import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, get, push } from "firebase/database";

/* =========================
   GET → Fetch all colleges
========================= */
export async function GET() {
  try {
    const dbRef = ref(database, "College-Names/");
    const snapshot = await get(dbRef);

    const data = snapshot.exists()
      ? Object.values(snapshot.val())
      : [];

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   POST → Add new college
========================= */
export async function POST(req) {
  try {
    const { collegeName } = await req.json();

    if (!collegeName?.trim()) {
      return NextResponse.json(
        { success: false, message: "College name required" },
        { status: 400 }
      );
    }

    const dbRef = ref(database, "College-Names/");
    const snapshot = await get(dbRef);

    const existing = snapshot.exists()
      ? Object.values(snapshot.val())
      : [];

    // 🔒 Prevent duplicates
    const exists = existing.some(
      (c) => c.toLowerCase() === collegeName.toLowerCase()
    );

    if (exists) {
      return NextResponse.json({
        success: false,
        message: "College already exists",
      });
    }

    await push(dbRef, collegeName.trim());

    return NextResponse.json({
      success: true,
      message: "College added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
