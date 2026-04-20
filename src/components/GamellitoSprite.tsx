"use client";
import { useState, useEffect } from "react";

const FRAMES = [
  "/assets/1.png",
  "/assets/2.png",
  "/assets/3.png",
  "/assets/4.png",
  "/assets/5.png",
  "/assets/6.png",
];

export function GamellitoSprite({ className = "" }: { className?: string }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 130);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="overflow-hidden" style={{ width: 320, height: 300 }}>
      <img
        src={FRAMES[frame]}
        alt="Gamellito empurrando uma caixa"
        className={className}
        style={{ height: "100%", width: "auto", maxWidth: "none" }}
      />
    </div>
  );
}
