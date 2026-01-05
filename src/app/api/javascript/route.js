import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, get, set } from "firebase/database";

export async function GET() {
  try {
    const dbRef = ref(database, "javascript/");
    const counterRef = ref(database, "JavascriptCounter/");

    // 🔹 Fetch questions
    const snapshot = await get(dbRef);
    const questions = snapshot.val();

    if (!questions) {
      return NextResponse.json({
        success: false,
        data: [],
        message: "No questions found",
      });
    }

    const questionsArray = Array.isArray(questions)
      ? questions
      : Object.values(questions);

    const totalQuestions = questionsArray.length;
    const questionsPerBatch = 10;

    // 🔹 Fetch counter
    const counterSnap = await get(counterRef);
    let counter = Number(counterSnap.val()) || 0;

    // 🔹 Reset counter if exceeded
    if (counter >= totalQuestions) {
      counter = 0;
    }

    const startIndex = counter;
    const endIndex = Math.min(counter + questionsPerBatch, totalQuestions);

    const batchQuestions = questionsArray.slice(startIndex, endIndex);

    // 🔹 Update counter
    await set(counterRef, endIndex);

    return NextResponse.json({
      success: true,
      data: batchQuestions,
      totalQuestions,
      startIndex,
      endIndex,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
