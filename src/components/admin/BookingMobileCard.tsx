import { BookingRowActions } from "@/components/admin/BookingRowActions";
import type { BookingStatus, BookingWithRelations } from "@/types/database";

function badgeClass(status: BookingStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-500/15 text-amber-200 ring-amber-500/35";
    case "confirmed":
      return "bg-sky-500/15 text-sky-200 ring-sky-500/35";
    case "cancelled":
      return "bg-zinc-500/15 text-zinc-300 ring-zinc-500/30";
    case "done":
      return "bg-emerald-500/15 text-emerald-200 ring-emerald-500/35";
    default:
      return "bg-zinc-500/15 text-zinc-300";
  }
}

const statusLabel: Record<BookingStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  cancelled: "ملغي",
  done: "تم",
};

export function BookingMobileCard({ b }: { b: BookingWithRelations }) {
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-4 shadow-lg shadow-black/40 ring-1 ring-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-white">{b.customer_name}</p>
          <p className="mt-1 font-mono text-sm text-zinc-400" dir="ltr">
            {b.phone}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${badgeClass(b.status)}`}
        >
          {statusLabel[b.status]}
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">الخدمة</dt>
          <dd className="mt-0.5 font-medium text-zinc-300">{b.service?.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">الحلاق</dt>
          <dd className="mt-0.5 font-medium text-zinc-300">{b.barber?.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">التاريخ</dt>
          <dd className="mt-0.5 text-zinc-400">{b.booking_date}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">الوقت</dt>
          <dd className="mt-0.5 text-zinc-400">{b.booking_time}</dd>
        </div>
      </dl>
      {b.notes?.trim() ? (
        <p className="mt-3 rounded-xl border border-white/[0.06] bg-black/30 px-3 py-2 text-xs leading-relaxed text-zinc-500">
          {b.notes}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
        <BookingRowActions bookingId={b.id} currentStatus={b.status} />
      </div>
    </article>
  );
}
