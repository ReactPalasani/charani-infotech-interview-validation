"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { shuffleQuestion } from "@/app/utils/shuffleQuestion";
import { shuffleArray } from "@/app/utils/shuffle";
import React, { useRef } from "react";
const ExamContext = createContext(null);

export function ExamProvider({ children }) {
  const [response,setResponse]=useState();
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
//   useEffect(() => {
//     fetch(`/api/${section.toLowerCase()}`)
//       .then(res => res.json())
//       .then(data => {
//         setQuestions(data.data || []);
//         setCurrentIndex(0);
//       });
//   }, [section]);

  useEffect(() => {
  async function loadQuestions() {
    try {
      const cached = localStorage.getItem(section);

      let questionsData = [];

      if (cached) {
        questionsData = JSON.parse(cached);
      } else {
        const res = await fetch(`/api/${section.toLowerCase()}`);
        const data = await res.json();
        questionsData = data.data || [];
        localStorage.setItem(section, JSON.stringify(questionsData));
      }

      // const shuffled = shuffleArray(questionsData)
      //   .map(shuffleQuestion)
      //   .filter(Boolean)
      //   .slice(0, 10);

      const finalQuestions = questionsData.slice(0, 20); 

      setQuestions(finalQuestions);
      setCurrentIndex(0);
    } catch (err) {

    }
  }

  loadQuestions();
}, [section]);

  // persist timer
  useEffect(() => {
    localStorage.setItem("exam-time", time);
  }, [time]);

   useEffect(() => {
  const disableRefresh = (e) => {
    // F5
    if (e.key === "F5") {
      e.preventDefault();
    }

    // Ctrl+R / Ctrl+Shift+R / Cmd+R
    if (
      (e.ctrlKey && e.key.toLowerCase() === "r") ||
      (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "r") ||
      (e.metaKey && e.key.toLowerCase() === "r")
    ) {
      e.preventDefault();
    }
  };

  window.addEventListener("keydown", disableRefresh);

  return () => {
    window.removeEventListener("keydown", disableRefresh);
  };
}, []);

useEffect(() => {
  const disableRefresh = (e) => {
    // F5
    if (e.key === "F5") {
      e.preventDefault();
    }

    // Ctrl+R / Ctrl+Shift+R / Cmd+R
    if (
      (e.ctrlKey && e.key.toLowerCase() === "r") ||
      (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "r") ||
      (e.metaKey && e.key.toLowerCase() === "r")
    ) {
      e.preventDefault();
    }
  };

  window.addEventListener("keydown", disableRefresh);

  return () => {
    window.removeEventListener("keydown", disableRefresh);
  };
}, []);

  return (
       <div >
    <ExamContext.Provider
      value={{
        response,
        setResponse,
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
        </div>
  );
}

export function useExam() {
  const ctx = useContext(ExamContext);
  if (!ctx) throw new Error("useExam must be inside ExamProvider");
  return ctx;
}
