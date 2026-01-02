import { create } from "zustand";

 const useExamStore = create((set, get) => ({
  sections: ["Aptitude", "Reasoning", "Communication"], // section order
  activeSection: "Aptitude",
  completedSections: [],
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  timer: 20 * 60, // 20 minutes in seconds

  // Set active section manually
  setActiveSection: (section) => {
    const { completedSections, activeSection } = get();
    if (completedSections.includes(section)) return; // lock completed section
    set({ activeSection: section, currentQuestionIndex: 0, timer: 20 * 60 });
  },

  // Load questions for current section
  setQuestions: (questions) => set({ questions, currentQuestionIndex: 0 }),

  // Record answer
  setAnswer: (questionIndex, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionIndex]: answer },
    })),

  // Move to next question
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex:
        state.currentQuestionIndex + 1 < state.questions.length
          ? state.currentQuestionIndex + 1
          : state.currentQuestionIndex,
    })),

  // Complete current section and auto switch
  completeSection: () => {
    const { activeSection, sections, completedSections } = get();
    const nextSectionIndex = sections.indexOf(activeSection) + 1;

    const nextSection =
      nextSectionIndex < sections.length ? sections[nextSectionIndex] : null;

    set({
      completedSections: [...completedSections, activeSection],
      activeSection: nextSection || activeSection,
      currentQuestionIndex: 0,
      timer: 20 * 60,
    });
  },

  // Timer management
  setTimer: (time) => set({ timer: time }),
}));

export default useExamStore;