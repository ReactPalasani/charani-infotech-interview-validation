import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, push, set, get } from "firebase/database";

// POST → Save student data
export async function POST(req) {
  try {
    const body = await req.json();

    const dbRef = ref(database, `Technical-1-Results/${body.collegeId}`);
    const newUserRef = push(dbRef);

    await set(newUserRef, body);

    return NextResponse.json({
      success: true,
      message: "Result saved successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const dbRef = ref(database, "Technical-1-Results/");
    const snapshot = await get(dbRef);
    console.log("Snapshot data:", snapshot.val());
    return NextResponse.json({
      success: true,
      data: snapshot.val(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


