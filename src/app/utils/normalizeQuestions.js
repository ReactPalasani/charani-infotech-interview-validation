export function normalizeQuestions(rawQuestions) {
  return rawQuestions.map((q, index) => ({
    id: index + 1,
    question: q.question1,
    options: [q.A, q.B, q.C, q.D],
    correctAnswer: q[q.Answer], // maps "C" → actual option
    answerKey: q.Answer,        // optional (A/B/C/D)
  }));
}
