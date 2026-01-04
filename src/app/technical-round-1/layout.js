"use client";

import { useEffect, useRef } from "react";

export default function ExamLayout1({ children }) {
  const ref = useRef(null);

  const enterFullscreen = async () => {
    if (ref.current?.requestFullscreen) {
      await ref.current.requestFullscreen();
    }
  };

  useEffect(() => {
    const handleExit = () => {
      if (!document.fullscreenElement) {
        alert("Fullscreen required for exam!");
        ref.current?.requestFullscreen();
      }
    };
    
    document.addEventListener("fullscreenchange", handleExit);

    return () =>
      document.removeEventListener("fullscreenchange", handleExit);
  }, []);

  return (
    <div ref={ref}>
      <button onClick={enterFullscreen} className="hidden" />
      {children}
    </div>
  );
}
