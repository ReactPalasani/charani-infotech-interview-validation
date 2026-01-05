
import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, push, set, get } from "firebase/database";

export async function GET() {
  try {
    const dbRef = ref(database, "Css/");
    const counterRef = ref(database, "CssCounter/"); 

    const snapshot = await get(dbRef);
    const questions = snapshot.val();

     if (!questions) {
      return NextResponse.json({ success: false, data: [], message: "No questions found" });
    }

        const questionsArray = Array.isArray(questions) ? questions : Object.values(questions);
    const totalQuestions = questionsArray.length;

    console.log("totalQuestions", totalQuestions);


        const counterSnap = await get(counterRef);
    let counter = counterSnap.val() || 0;

      const questionsPerBatch = 10;
    let startIndex = counter;
    let endIndex = counter + questionsPerBatch;

    if (endIndex >= totalQuestions) {
      endIndex = totalQuestions;
      counter = 0; // reset counter after reaching the end
    } else {
      counter = endIndex; // update counter for next fetch
    }

     const batchQuestions = questionsArray.slice(startIndex, endIndex);
      await set(counterRef, counter);

    console.log("count",counter);

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
