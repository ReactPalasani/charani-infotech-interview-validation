'use client';
import { push, ref } from "firebase/database";
import { useState,useEffect } from "react";
import { database } from "../lib/firebase";

export default function Home() {
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
       
      </main>
    </div>
  );
}
