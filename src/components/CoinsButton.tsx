"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CoinsButton() {
  const router = useRouter();
  const [coins, setCoins] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/perfil")
      .then((r) => r.json())
      .then((d) => { if (typeof d.coins === "number") setCoins(d.coins); })
      .catch(() => {});
  }, []);

  return (
    <button
      onClick={() => router.push("/diario/moedas")}
      className="gm-btn gm-btn--sun gm-btn--md flex items-center gap-2"
    >
      <span className="text-lg">🪙</span>
      <span className="font-display font-bold">
        {coins !== null ? coins : "0"}
      </span>
    </button>
  );
}
