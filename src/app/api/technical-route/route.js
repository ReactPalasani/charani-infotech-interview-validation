import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, push, set, get } from "firebase/database";// GET → Fetch aptitude questions
export async function GET() {
  try {
    const dbRef = ref(database, "Technical/");
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
