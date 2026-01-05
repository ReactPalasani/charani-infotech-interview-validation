import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, push, set, get } from "firebase/database";

// POST → Save student data

function encodeEmail(email) {
  return email.replace(/\./g, "_");
}

export async function POST(req) {
  try {
    const body = await req.json();
const emailKey = encodeEmail(body.email);


    const dbRef = ref(database, `AdminUsers/${emailKey}`);

    await set(dbRef, body);
     
    return NextResponse.json({
      success: true,
      message: "Successfully Registred",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}