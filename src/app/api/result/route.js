import { NextResponse } from "next/server";
import { database } from "@/lib/firebase";
import { ref, push, set, get } from "firebase/database";

// POST → Save student data
export async function POST(req) {
  try {
    const body = await req.json();

    const dbRef = ref(database, `ExamResults/${body.studentId}`);
    const newUserRef = push(dbRef);

    await set(newUserRef, body);

    return NextResponse.json({
      success: true,
      message: "Result saved successfully",
    });
  } catch (error) {

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


// export async function GET() {
//   try {
//     const dbRef = ref(database, "ExamResults/");
//     const snapshot = await get(dbRef);

//     return NextResponse.json({
//       success: true,
//       data: snapshot.val(),
//     });
//   } catch (error) {

//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  try {
    // Fetch exam results
    const examRef = ref(database, "ExamResults/");
    const examSnap = await get(examRef);

    // Fetch users
    const usersRef = ref(database, "users/");
    const usersSnap = await get(usersRef);

    const examData = examSnap.exists() ? examSnap.val() : {};
    const usersData = usersSnap.exists() ? usersSnap.val() : {};

    const finalResults = [];

    // Loop exam results
    for (const studentId in examData) {
      const examAttempts = examData[studentId];

      for (const attemptId in examAttempts) {
        const exam = examAttempts[attemptId];

        // Extract phone from users
        let phone = null;
        if (usersData[studentId]) {
          const userObj = Object.values(usersData[studentId])[0];
          phone = userObj?.phone || null;
        }

        finalResults.push({
          ...exam,
          phone,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: finalResults,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
