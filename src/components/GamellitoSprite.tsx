"use client";
import { motion } from "framer-motion";
import { siteAssets } from "@/components/SiteAssets";

export function GamellitoSprite({ className = "" }: { className?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      className="flex justify-center items-center"
    >
      <img
        src={siteAssets.gamellitoCorpinho}
        alt="Gamellito"
        className={className}
        style={{ width: 200, height: "auto" }}
      />
    </motion.div>
  );
}
