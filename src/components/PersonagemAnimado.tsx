"use client";

import { motion } from "framer-motion";

/**
 * Componente reutilizável: envolve qualquer SVG (ou elemento) com animação
 * de subir e descer suavemente. Pode passar qualquer SVG como children.
 */
export function PersonagemAnimado({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`flex justify-center items-center p-4 ${className}`.trim()}
    >
      {children}
    </motion.div>
  );
}
