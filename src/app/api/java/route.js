import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, get, set } from "firebase/database";
import { shuffleArray } from "@/app/utils/shuffle";

export async function GET() {
  try {
    const dbRef = ref(database, "Java");
    const counterRef = ref(database, "JavaCounter");

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

    // 🔹 Remove any question with null/empty fields
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
    const questionsPerBatch = 10;

    if (totalQuestions < questionsPerBatch) {
      return NextResponse.json({
        success: false,
        data: [],
        message: "Not enough valid questions",
      });
    }

    // 🔹 Fetch counter
    const counterSnap = await get(counterRef);
    let counter = Number(counterSnap.val()) || 0;

    // 🔹 Shuffle questions
    let shuffled = shuffleArray([...validQuestions]);

    // 🔹 Reset counter if exceeding batch
    if (counter + questionsPerBatch > totalQuestions) {
      counter = 0;
      shuffled = shuffleArray([...validQuestions]);
    }

    const startIndex = counter;
    const endIndex = startIndex + questionsPerBatch;

    // 🔹 Hide correct answer
    const batchQuestions = shuffled
      .slice(startIndex, endIndex)
      .map(q => ({
        question1: q.question1,
        A: q.A,
        B: q.B,
        C: q.C,
        D: q.D,
        Answer: q.Answer,
      }));

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
