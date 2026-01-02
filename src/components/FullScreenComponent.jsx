"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";

const FullScreenComponent = () => {
  const fullScreenTargetRef = useRef(null);
  const router = useRouter();

  const handleFullScreen = async () => {
    const el = fullScreenTargetRef.current;

    if (!el) return;

    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      }

    } catch (err) {
   
    }
  };

  return (
    <div
      ref={fullScreenTargetRef}
    >
      <h1>Target Content</h1>
      <p>This is the content that will go full screen.</p>

      <button
        onClick={handleFullScreen}
        className="bg-blue-900 text-white p-2 rounded-sm"
      >
        Go Full Screen
      </button>
    </div>
  );
};

export default FullScreenComponent;
