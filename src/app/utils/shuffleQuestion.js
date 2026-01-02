import { shuffleArray } from "./shuffle";

export function shuffleQuestion(question) {
  const options = ["A", "B", "C", "D"].map((key) => ({
    key,
    value: question[key],
  }));

  const shuffled = shuffleArray(options);

  const newQuestion = { ...question };
  let newAnswer = "";

  shuffled.forEach((opt, index) => {
    const newKey = ["A", "B", "C", "D"][index];
    newQuestion[newKey] = opt.value;

    if (opt.key === question.Answer) {
      newAnswer = newKey;
    }
  });

  newQuestion.Answer = newAnswer;

  return newQuestion;
}
