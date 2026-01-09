import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, get,update } from "firebase/database";

export async function GET() {
  try {
    const dbRef = ref(database, "College-Names/");
    const snapshot = await get(dbRef);

    const rawData = snapshot.exists()
      ? Object.values(snapshot.val())
      : [];

    const activeColleges = rawData.filter(
      (item) => typeof item === "object" && item.status === "active"
    );

    return NextResponse.json({
      success: true,
      data: activeColleges,
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
    const body = await req.json();
  console.log("college names ", body.collegeName);
    if (!body.collegeName?.trim()) {
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
      (c) => c.toLowerCase() === body.collegeName.toLowerCase()
    );

    if (exists) {
      return NextResponse.json({
        success: false,
        message: "College already exists",
      });
    }

    await push(dbRef,body );

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

/* =========================
   PUT → Update college Status
========================= */

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "College id and status are required" },
        { status: 400 }
      );
    }

    const collegeRef = ref(database, `College-Names/${id}`);
    const snapshot = await get(collegeRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { success: false, message: "College not found" },
        { status: 404 }
      );
    }

    await update(collegeRef, { status });

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
