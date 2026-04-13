"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 top-0 h-[520px] w-[520px] rounded-full bg-amber-500/[0.07] blur-[120px]" />
        <div className="absolute -right-1/4 bottom-0 h-[420px] w-[420px] rounded-full bg-amber-600/[0.05] blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,162,39,0.14),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <Container className="relative py-16 sm:py-20 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-28">
        <div>
          <motion.div
            initial={{ opacity: 1, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/[0.08] px-3 py-1 text-xs font-semibold text-amber-200/95 ring-1 ring-amber-400/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
              مصر · حجز أونلاين فوري
            </p>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              احلق وانت مرتاح{" "}
              <span className="inline-block" aria-hidden>
                👌
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
              قص شعر، تهذيب ذقن، وباكيدج كامل — مواعيد واضحة، مفيش ازدحام، وتجربة راقية من أول خطوة.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <motion.a
                href="#booking"
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px -8px rgba(232,197,71,0.55)" }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-l from-amber-400 via-amber-500 to-amber-600 px-8 py-3.5 text-base font-bold text-zinc-950 shadow-[0_12px_40px_-12px_rgba(245,197,66,0.55)] ring-1 ring-amber-300/50"
              >
                احجز دلوقتي
              </motion.a>
              <motion.a
                href="#services"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-7 py-3.5 text-base font-semibold text-zinc-200 ring-1 ring-white/[0.06] backdrop-blur-sm transition hover:border-amber-500/25 hover:text-amber-200"
              >
                استكشف الخدمات
              </motion.a>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-3 border-t border-white/[0.06] pt-10 sm:gap-4">
              {[
                { k: "مواعيد", v: "يومية" },
                { k: "فريق", v: "محترف" },
                { k: "تجربة", v: "VIP" },
              ].map((item, i) => (
                <motion.div
                  key={item.k}
                  initial={{ opacity: 1, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.35, ease: "easeOut" }}
                  className="text-center sm:text-start"
                >
                  <dt className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">{item.k}</dt>
                  <dd className="mt-1 text-sm font-semibold text-zinc-100 sm:text-base">{item.v}</dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 1, scale: 1, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.04, duration: 0.45, ease: "easeOut" }}
          className="relative mt-14 hidden lg:mt-0 lg:block"
        >
          <div className="relative aspect-[4/5] max-h-[420px] overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-zinc-900/80 to-black shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.04]">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-90"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">Premium cut</p>
              <p className="mt-2 text-2xl font-bold text-white">شغل نظيف · خطوط حادة</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">
                نهتم بالتفاصيل: الاستشارة، القص، واللمسة الأخيرة قبل ما تمشي.
              </p>
            </div>
          </div>
          <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-2xl border border-amber-500/20 bg-amber-500/5 blur-sm" />
          <div className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-amber-500/10 blur-2xl" />
        </motion.div>
      </Container>
    </section>
  );
}
