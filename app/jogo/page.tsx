"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JogoPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/jogos/experimente");
  }, [router]);
  return null;
}
