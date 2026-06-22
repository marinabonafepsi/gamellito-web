"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@/components/icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  variant?: "white" | "cream" | "sun" | "lilac";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  variant = "white",
  className = "",
}: ModalProps) {
  const cardVariant = variant === "white" ? "" : `ds-card--${variant}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            key="modal-content"
            className={`relative w-full max-w-md ds-card ${cardVariant} p-8 md:p-10 ${className}`}
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1 hover:opacity-70 transition-opacity"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>

            {/* Title */}
            {title && (
              <h2 className="font-display text-2xl font-bold mb-4" style={{ color: "#2B2233" }}>
                {title}
              </h2>
            )}

            {/* Content */}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
