"use client";
import { useExam } from "@/context/ExamContext";
import { useEffect } from "react";


export default function Timer() {
  const { time, setTime } = useExam();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-white p-2 text-center">
      Time Left: {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
    </div>
  );
}
