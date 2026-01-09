import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, get } from "firebase/database";

export async function GET() {
  try {
    const dbRef = ref(database, "College-Names/");
    const snapshot = await get(dbRef);

    const data = snapshot.exists()
      ? Object.entries(snapshot.val()).map(([id, value]) => ({
          id,
          ...value,
        }))
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
