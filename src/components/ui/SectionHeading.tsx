"use client";

import { motion } from "framer-motion";

export function SectionHeading({
  kicker,
  title,
  description,
  align = "start",
}: {
  kicker?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
}) {
  const isCenter = align === "center";
  return (
    <motion.div
      initial={{ opacity: 1, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`max-w-2xl ${isCenter ? "mx-auto text-center" : ""}`}
    >
      {kicker ? (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500/90 sm:text-xs">
          {kicker}
        </p>
      ) : null}
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">{title}</h2>
      {description ? (
        <p className={`mt-3 text-base leading-relaxed text-zinc-400 sm:text-lg ${isCenter ? "mx-auto" : ""}`}>
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
