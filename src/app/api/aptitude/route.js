import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, get, set } from "firebase/database";
import { shuffleArray } from "@/app/utils/shuffle";

export async function GET() {
  try {
    const dbRef = ref(database, "Aptitude");
    const counterRef = ref(database, "AptitudeCounter");

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
    const questionsPerBatch = 20;

    // 🔹 get counter
    const counterSnap = await get(counterRef);
    let counter = Number(counterSnap.val()) || 0;

    // 🔹 shuffle ONCE per cycle
    let shuffled = shuffleArray([...questionsArray]);

    // 🔹 if remaining questions < 20 → reset
    if (counter + questionsPerBatch > totalQuestions) {
      counter = 0;
      shuffled = shuffleArray([...questionsArray]);
    }

    const startIndex = counter;
    const endIndex = startIndex + questionsPerBatch;

    const batchQuestions = shuffled.slice(startIndex, endIndex);

    // 🔹 update counter
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
