import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, get, set } from "firebase/database";
import { shuffleArray } from "@/app/utils/shuffle"; // Make sure you have this utility

export async function GET() {
  try {
    const dbRef = ref(database, "Reasoning");
    const counterRef = ref(database, "ReasoningCounter");

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
    const questionsPerBatch = 20;

    // 🔹 Fetch counter
    const counterSnap = await get(counterRef);
    let counter = Number(counterSnap.val()) || 0;

    // 🔹 Shuffle ONCE per cycle
    let shuffled = shuffleArray([...questionsArray]);

    // 🔹 If remaining questions < 20 → reset counter & reshuffle
    if (counter + questionsPerBatch > totalQuestions) {
      counter = 0;
      shuffled = shuffleArray([...questionsArray]);
    }

    const startIndex = counter;
    const endIndex = startIndex + questionsPerBatch;

         const batchQuestions = shuffled
      .slice(startIndex, endIndex)
      .map(q => ({
        question: q.question ?? null,
        A: q.A ?? null,
        B: q.B ?? null,
        C: q.C ?? null,
        D: q.D ?? null,
        Answer: q.Answer ?? null,
      }));


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
