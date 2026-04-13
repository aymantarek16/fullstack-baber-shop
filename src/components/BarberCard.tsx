"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import type { BarberRow } from "@/types/database";

export function BarberCard({ barber, index }: { barber: BarberRow; index: number }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <motion.li
      initial={{ opacity: 1, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121215] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.04]">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          {!imgFailed ? (
            <Image
              src={barber.image_url}
              alt={barber.name}
              fill
              className="object-cover transition duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImgFailed(true)}
            />
          ) : null}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-amber-900/40 via-zinc-900 to-black ${imgFailed ? "opacity-100" : "opacity-0"}`}
            aria-hidden
          />
          {imgFailed ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
              <span className="text-4xl opacity-80" aria-hidden>
                ✂
              </span>
              <span className="text-sm font-medium text-zinc-400">صورة غير متاحة</span>
            </div>
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/25 to-transparent opacity-90" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/50 to-transparent opacity-60" />
        </div>

        <div className="relative border-t border-white/[0.06] bg-[#0c0c0e]/90 p-5 backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500/85">حلاق</p>
              <h3 className="mt-1 text-xl font-bold text-white">{barber.name}</h3>
            </div>
            <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold text-zinc-400">
              متاح للحجز
            </span>
          </div>
          {barber.tagline ? (
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{barber.tagline}</p>
          ) : null}
          <motion.a
            href="#booking"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-5 flex min-h-[44px] w-full items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/[0.08] text-sm font-semibold text-amber-200 transition hover:border-amber-400/45 hover:bg-amber-500/15"
          >
            احجز مع {barber.name}
          </motion.a>
        </div>
      </div>
    </motion.li>
  );
}
