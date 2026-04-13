"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ServiceRow } from "@/types/database";

export function ServicesSection({ services }: { services: ServiceRow[] }) {
  return (
    <section id="services" className="scroll-mt-24 border-b border-white/[0.06] py-20 sm:py-24">
      <Container>
        <SectionHeading
          kicker="الخدمات"
          title="باقات واضحة، ووقت متوقع لكل خدمة"
          description="تسعير شفاف بدون مفاجآت — اختار اللي يناسبك واحجز في ثواني."
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map((s, i) => (
            <motion.li
              key={s.id}
              initial={{ opacity: 1, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.45, ease: "easeOut" }}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 380, damping: 28 } }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.75)] ring-1 ring-white/[0.04] backdrop-blur-sm sm:p-7"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl transition group-hover:bg-amber-400/15" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white sm:text-xl">{s.name}</h3>
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs font-medium text-zinc-400">
                    <span className="text-amber-500/90" aria-hidden>
                      ⏱
                    </span>
                    تقريبًا {s.duration_minutes} دقيقة
                  </p>
                </div>
                <span className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-200/90">
                  خدمة
                </span>
              </div>
              <div className="mt-6 flex items-end justify-between gap-3 border-t border-white/[0.06] pt-6">
                <div>
                  <p className="text-xs font-medium text-zinc-500">السعر يبدأ من</p>
                  <p className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-black tabular-nums text-amber-400 sm:text-4xl">
                      {Number(s.price).toFixed(0)}
                    </span>
                    <span className="text-sm font-semibold text-zinc-400">ج.م</span>
                  </p>
                </div>
                <motion.a
                  href="#booking"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="shrink-0 rounded-full border border-amber-500/35 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200 transition group-hover:border-amber-400/50 group-hover:bg-amber-500/15"
                >
                  احجز
                </motion.a>
              </div>
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
