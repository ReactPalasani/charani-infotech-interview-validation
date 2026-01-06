import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, get, set } from "firebase/database";
import { shuffleArray } from "@/app/utils/shuffle"; // Make sure you have this utility

export async function GET() {
  try {
    const dbRef = ref(database, "Communication");
    const counterRef = ref(database, "CommunicationCounter");

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
   
               const validQuestions = questionsArray.filter(q =>
      q &&
      q.question1 &&
      q.A &&
      q.B &&
      q.C &&
      q.D &&
      q.Answer
    );
    const totalQuestions = validQuestions.length;
    const questionsPerBatch = 20;

    // 🔹 Fetch counter
    const counterSnap = await get(counterRef);
    let counter = Number(counterSnap.val()) || 0;

    // 🔹 Shuffle ONCE per cycle
    let shuffled = shuffleArray([...validQuestions]);

    // 🔹 If remaining questions < 20 → reset counter & reshuffle
    if (counter + questionsPerBatch > totalQuestions) {
      counter = 0;
      shuffled = shuffleArray([...validQuestions]);
    }

   

    const startIndex = counter;
    const endIndex = startIndex + questionsPerBatch;

         const batchQuestions = shuffled
      .slice(startIndex, endIndex)
      .map(q => ({
        question1: q.question1 ?? null,
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
