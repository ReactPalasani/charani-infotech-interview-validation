"use client";
import { createContext, use, useContext, useEffect, useState } from "react";

const ExamContext = createContext(null);

export function ExamProvider({ children }) {

  const [section, setSection] = useState("Aptitude");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState({
    Aptitude: {},
    Reasoning: {},
    Communication: {},
  });

  // ⏱ timer (persist)
  const [time, setTime] = useState(60*60); // default 1 hour

  // 🔹 Load persisted time only on client
  useEffect(() => {
    const savedTime = localStorage.getItem("exam-time");
    if (savedTime) setTime(Number(savedTime));
  }, []);


    useEffect(() => {
    const savedSection = localStorage.getItem("exam-section");
    if (savedSection) setSection(savedSection);
  }, []);

    // persist section
  useEffect(() => {
    localStorage.setItem("exam-section", section);
  }, [section]);

  useEffect(() => {
    const savedAnswers = localStorage.getItem("exam-answers");
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
  }, []);

  // persist answers
  useEffect(() => {
    localStorage.setItem("exam-answers", JSON.stringify(answers));
  }, [answers]);

  
  // fetch questions on section change
  useEffect(() => {
    fetch(`/api/${section.toLowerCase()}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data.data || []);
        setCurrentIndex(0);
      });
  }, [section]);

  // persist timer
  useEffect(() => {
    localStorage.setItem("exam-time", time);
  }, [time]);

  return (
    <ExamContext.Provider
      value={{
        section,
        setSection,
        questions,
        setQuestions,
        currentIndex,
        setCurrentIndex,
        answers,
        setAnswers,
        time,
        setTime,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const ctx = useContext(ExamContext);
  if (!ctx) throw new Error("useExam must be inside ExamProvider");
  return ctx;
}
