import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, push, set, get } from "firebase/database";

// POST → Save student data


export async function GET() {
  try {
    const dbRef = ref(database, "Tr1Result/");
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