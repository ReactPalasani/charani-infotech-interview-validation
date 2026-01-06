import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, push, set, get } from "firebase/database";

// POST → Save student data
export async function POST(req) {
  try {
    const body = await req.json();

    const dbRef = ref(database, `Selected-for-Hr/${body.studentId}`);
    const newUserRef = push(dbRef);

    await set(newUserRef, body);

    return NextResponse.json({
      success: true,
      message: "Result saved successfully",
    });
  } catch (error) {

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const dbRef = ref(database, "Selected-for-Hr/");
    const snapshot = await get(dbRef);

    return NextResponse.json({
      success: true,
      data: snapshot.val(),
    });
  } catch (error) {

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
