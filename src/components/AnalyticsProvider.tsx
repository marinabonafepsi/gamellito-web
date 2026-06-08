"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView, observeSections } from "@/lib/analytics";
import { IdentifyModal } from "@/components/IdentifyModal";

/**
 * Wrapper global que:
 * - Dispara page_view em cada navegação
 * - Observa seções com data-track-section e dispara section_view
 * - Renderiza o IdentifyModal de identificação automática
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);

  /* Page view */
  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;
    trackPageView(pathname);
  }, [pathname]);

  /* Section tracking — re-observa após render da nova página */
  useEffect(() => {
    const cleanup = observeSections(pathname);
    // Pequeno delay para garantir que o DOM já renderizou
    const timer = setTimeout(() => {
      cleanup();
      observeSections(pathname);
    }, 800);
    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [pathname]);

  return (
    <>
      {children}
      <IdentifyModal autoShowDelay={45_000} />
    </>
  );
}
