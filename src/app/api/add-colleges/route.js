import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, get, push, update } from "firebase/database";

/* =========================
   GET → Active Colleges (Public)
========================= */
export async function GET() {
  try {
    const dbRef = ref(database, "College-Names/");
    const snapshot = await get(dbRef);

    const rawData = snapshot.exists()
      ? Object.values(snapshot.val())
      : [];

    const activeColleges = rawData.filter(
      (item) => item?.status === "active"
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
   POST → Add College
========================= */
export async function POST(req) {
  try {
    const body = await req.json();

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

    const newName = body.collegeName.trim().toLowerCase();

    const exists = existing.some((c) => {
      const name =
        typeof c === "object" && c.collegeName
          ? c.collegeName
          : "";
      return name.toLowerCase() === newName;
    });

    if (exists) {
      return NextResponse.json({
        success: false,
        message: "College already exists",
      });
    }

    await push(dbRef, {
      collegeName: body.collegeName.trim(),
      status: body.status,
    });

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
   PUT → Update Status
========================= */
export async function PUT(req) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "ID and status required" },
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
