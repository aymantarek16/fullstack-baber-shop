"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";

const NAV = [
  { href: "#services", label: "الخدمات" },
  { href: "#barbers", label: "الفريق" },
  { href: "#gallery", label: "المعرض" },
  { href: "#booking", label: "الحجز" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-b border-white/[0.08] bg-[#0c0c0e]/75 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-[#0c0c0e]/40 backdrop-blur-md"
      }`}
    >
      <Container className="flex h-[4.25rem] items-center justify-between gap-4 sm:h-[4.5rem]">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/25 to-amber-600/10 ring-1 ring-amber-500/35 transition group-hover:ring-amber-400/55">
            <span className="text-sm font-black text-amber-400">✂</span>
          </span>
          <span className="text-base font-bold tracking-tight sm:text-lg">
            <span className="bg-gradient-to-l from-amber-200 to-amber-500 bg-clip-text text-transparent">صالون</span>
            <span className="text-zinc-100"> الحلاقة</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="التنقل الرئيسي">
          {NAV.slice(0, 3).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.04] hover:text-amber-300"
            >
              {item.label}
            </a>
          ))}
          <motion.a
            href="#booking"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mr-1 inline-flex items-center justify-center rounded-full bg-gradient-to-l from-amber-400 to-amber-600 px-5 py-2 text-sm font-semibold text-zinc-950 shadow-[0_0_24px_-4px_rgba(245,197,66,0.45)] ring-1 ring-amber-400/40"
          >
            احجز موعد
          </motion.a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <motion.a
            href="#booking"
            whileTap={{ scale: 0.97 }}
            className="rounded-full bg-gradient-to-l from-amber-400 to-amber-600 px-3.5 py-2 text-xs font-bold text-zinc-950 shadow-md shadow-amber-900/30"
          >
            احجز
          </motion.a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-200 transition hover:border-amber-500/30 hover:bg-white/[0.06]"
          >
            <span className="relative block h-3.5 w-5">
              <motion.span
                className="absolute left-0 top-0 h-0.5 w-full rounded-full bg-current"
                animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 top-[6px] h-0.5 w-full rounded-full bg-current"
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="absolute left-0 top-3 h-0.5 w-full rounded-full bg-current"
                animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </span>
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-white/[0.06] bg-[#0c0c0e]/95 backdrop-blur-xl md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.25 }}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3.5 text-base font-medium text-zinc-200 transition hover:bg-white/[0.05] hover:text-amber-300"
                >
                  {item.label}
                </motion.a>
              ))}
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
