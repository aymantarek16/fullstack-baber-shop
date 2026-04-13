"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createBooking, getBookedSlots } from "@/app/actions/booking";
import { generateTimeSlotLabels } from "@/lib/slots";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { BarberRow, ServiceRow } from "@/types/database";

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const inputClass =
  "mt-2 w-full min-h-[48px] rounded-xl border border-white/[0.1] bg-black/35 px-4 py-3 text-[15px] text-zinc-100 shadow-inner shadow-black/20 outline-none transition placeholder:text-zinc-600 focus:border-amber-500/45 focus:ring-2 focus:ring-amber-500/25 disabled:cursor-not-allowed disabled:opacity-45";

const labelClass = "block text-sm font-semibold text-zinc-300";

export function BookingForm({
  barbers,
  services,
  hasWhatsAppConfig,
}: {
  barbers: BarberRow[];
  services: ServiceRow[];
  hasWhatsAppConfig: boolean;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [barberId, setBarberId] = useState(barbers[0]?.id ?? "");
  const [date, setDate] = useState(todayIso());
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [taken, setTaken] = useState<string[]>([]);
  const [loadSlots, setLoadSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const allSlots = useMemo(() => generateTimeSlotLabels(), []);

  useEffect(() => {
    if (!barberId || !date) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setLoadSlots(true);
      setError(null);
      void getBookedSlots(barberId, date).then((res) => {
        if (cancelled) return;
        setLoadSlots(false);
        if (!res.ok) {
          setTaken([]);
          setError(res.error);
          return;
        }
        setTaken(res.taken);
        setTimeSlot((prev) => (prev && res.taken.includes(prev) ? "" : prev));
      });
    });
    return () => {
      cancelled = true;
    };
  }, [barberId, date]);

  const availableSlots = useMemo(() => {
    return allSlots.filter((s) => !taken.includes(s));
  }, [allSlots, taken]);

  async function refreshSlotsAfterBooking() {
    if (!barberId || !date) return;
    setLoadSlots(true);
    const res = await getBookedSlots(barberId, date);
    setLoadSlots(false);
    if (!res.ok) {
      setTaken([]);
      setError(res.error);
      return;
    }
    setTaken(res.taken);
    setTimeSlot((prev) => (prev && res.taken.includes(prev) ? "" : prev));
  }

  const serviceName = services.find((s) => s.id === serviceId)?.name ?? "";
  const barberName = barbers.find((b) => b.id === barberId)?.name ?? "";

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!hasWhatsAppConfig) {
      setError("رقم واتساب النشاط غير مُعد في الإعدادات");
      return;
    }
    startTransition(async () => {
      const res = await createBooking({
        customerName: name,
        phone,
        serviceId,
        barberId,
        bookingDate: date,
        timeSlot,
        notes,
        serviceName,
        barberName,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSuccess(true);
      window.open(res.whatsappUrl, "_blank", "noopener,noreferrer");
      void refreshSlotsAfterBooking();
    });
  }

  return (
    <section id="booking" className="scroll-mt-24 py-20 sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            kicker="الحجز"
            title="احجز موعدك في دقايق"
            description="بياناتك تتسجل مباشرة في النظام — وبنفتحلك واتساب برسالة جاهزة فيها كل التفاصيل."
            align="center"
          />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {["تأكيد فوري", "بدون ازدحام", "دعم واتساب"].map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-400 ring-1 ring-white/[0.04]"
              >
                <span className="h-1 w-1 rounded-full bg-amber-400/90" />
                {t}
              </span>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-12 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.12] to-emerald-950/[0.15] p-10 text-center shadow-[0_24px_80px_-32px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/15"
              >
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-3xl text-zinc-950 shadow-lg shadow-emerald-900/40"
                  aria-hidden
                >
                  ✓
                </motion.div>
                <h3 className="mt-6 text-xl font-bold text-emerald-100 sm:text-2xl">تم تسجيل الحجز بنجاح</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
                  فتحنا واتساب في نافذة جديدة برسالة فيها بياناتك. لو مافتحش، تقدر ترجع تحجز تاني أو تتواصل معانا
                  من أسفل الصفحة.
                </p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSuccess(false);
                    setName("");
                    setPhone("");
                    setNotes("");
                    setTimeSlot("");
                  }}
                  className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                >
                  حجز جديد
                </motion.button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 1, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={onSubmit}
                className="mt-12 rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-6 shadow-[0_28px_90px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.05] backdrop-blur-md sm:p-9"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className={labelClass}>
                    الاسم الكامل
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      placeholder="مثال: أحمد محمود"
                      autoComplete="name"
                    />
                  </label>
                  <label className={labelClass}>
                    رقم الموبايل
                    <input
                      required
                      dir="ltr"
                      className={`${inputClass} text-left`}
                      placeholder="01xxxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </label>
                </div>

                <div className="mt-6 border-t border-white/[0.06] pt-6">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500/90">اختيار الخدمة والحلاق</p>
                  <div className="mt-4 grid gap-6 sm:grid-cols-2">
                    <label className={labelClass}>
                      الخدمة
                      <select
                        required
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        className={inputClass}
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} — {Number(s.price).toFixed(0)} ج.م ({s.duration_minutes} د)
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className={labelClass}>
                      الحلاق
                      <select
                        required
                        value={barberId}
                        onChange={(e) => setBarberId(e.target.value)}
                        className={inputClass}
                      >
                        {barbers.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/[0.06] pt-6">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500/90">الموعد</p>
                  <div className="mt-4 grid gap-6 sm:grid-cols-2">
                    <label className={labelClass}>
                      التاريخ
                      <input
                        required
                        type="date"
                        min={todayIso()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={inputClass}
                      />
                    </label>
                    <label className={labelClass}>
                      الوقت
                      <div className="relative">
                        <select
                          required
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          disabled={loadSlots || availableSlots.length === 0}
                          className={`${inputClass} appearance-none pr-10`}
                        >
                          <option value="">
                            {loadSlots
                              ? "جاري تحميل المواعيد…"
                              : availableSlots.length
                                ? "اختر الوقت"
                                : "مفيش مواعيد فاضية"}
                          </option>
                          {availableSlots.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {loadSlots ? (
                          <span className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400" />
                        ) : null}
                      </div>
                    </label>
                  </div>
                </div>

                <label className={`${labelClass} mt-6 block`}>
                  ملاحظات إضافية{" "}
                  <span className="text-xs font-normal text-zinc-500">(اختياري)</span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className={`${inputClass} min-h-[100px] resize-y`}
                    placeholder="أي تفاصيل تحب الحلاق يعرفها قبل الموعد؟"
                  />
                </label>

                <AnimatePresence>
                  {error ? (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-5 overflow-hidden rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-200 ring-1 ring-red-500/20"
                      role="alert"
                    >
                      {error}
                    </motion.p>
                  ) : null}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isPending || !hasWhatsAppConfig}
                  whileHover={!isPending && hasWhatsAppConfig ? { scale: 1.01 } : undefined}
                  whileTap={!isPending && hasWhatsAppConfig ? { scale: 0.99 } : undefined}
                  className="mt-8 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-l from-amber-400 via-amber-500 to-amber-600 text-base font-bold text-zinc-950 shadow-[0_16px_50px_-12px_rgba(245,197,66,0.55)] ring-1 ring-amber-300/45 transition disabled:cursor-not-allowed disabled:opacity-35"
                >
                  {isPending ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950/30 border-t-zinc-950" />
                      جاري الحجز…
                    </>
                  ) : (
                    <>تأكيد الحجز وفتح واتساب</>
                  )}
                </motion.button>

                {!hasWhatsAppConfig ? (
                  <p className="mt-4 text-center text-xs leading-relaxed text-amber-200/85">
                    أضف المتغير <code className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-zinc-300">NEXT_PUBLIC_WHATSAPP_BUSINESS_PHONE</code> في{" "}
                    <code className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-zinc-300">.env.local</code> لإكمال
                    الحجز.
                  </p>
                ) : (
                  <p className="mt-4 text-center text-[11px] text-zinc-500">
                    بإتمام الحجز أنت توافق على التواصل معاك لتأكيد الميعاد عند الحاجة.
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
