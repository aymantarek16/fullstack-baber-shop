"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteBooking, updateBookingStatus } from "@/app/actions/admin";
import type { BookingStatus } from "@/types/database";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

const STATUSES: BookingStatus[] = ["pending", "confirmed", "cancelled", "done"];

const labels: Record<BookingStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  cancelled: "ملغي",
  done: "تم",
};

const selectClass =
  "h-10 w-full appearance-none rounded-xl border border-white/10 bg-zinc-950/90 pr-4 pl-8 text-right text-sm font-semibold text-white outline-none transition focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/15 disabled:cursor-not-allowed disabled:opacity-50";

const deleteBtnClass =
  "h-10 w-[105px] shrink-0 rounded-xl border border-red-500/30 bg-red-500/10 px-3 text-sm font-bold text-red-300 transition hover:bg-red-500/15 hover:border-red-500/45 disabled:cursor-not-allowed disabled:opacity-50 max-md:w-[96px]";

export function BookingRowActions({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: BookingStatus;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [status, setStatus] = useState<BookingStatus>(currentStatus);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function onStatusChange(next: BookingStatus) {
    setStatus(next);
    setMsg(null);
    setPending(true);

    const r = await updateBookingStatus(bookingId, next);

    setPending(false);

    if (!r.ok) {
      setStatus(currentStatus);
      setMsg(r.error);
      return;
    }

    router.refresh();
  }

  function onDelete() {
    setIsDeleteModalOpen(true);
  }

  async function confirmDelete() {
    setMsg(null);
    setIsDeleting(true);

    const r = await deleteBooking(bookingId);

    setIsDeleting(false);
    setIsDeleteModalOpen(false);

    if (!r.ok) {
      setMsg(r.error);
      return;
    }

    router.refresh();
  }

  return (
    <>
      <div className="flex min-w-52.5 items-center justify-end gap-2 py-1 max-md:min-w-45">
        <div className="relative w-28.75 shrink-0 max-md:w-25">
          <select
            dir="rtl"
            disabled={pending}
            value={status}
            onChange={(e) => void onStatusChange(e.target.value as BookingStatus)}
            className={selectClass}
            aria-label="تغيير حالة الحجز"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {labels[s]}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-white/60">
            ▼
          </span>
        </div>

        <button
          type="button"
          disabled={pending || isDeleting}
          onClick={onDelete}
          className={deleteBtnClass}
        >
          {isDeleting ? "جاري..." : "حذف"}
        </button>
      </div>

      {msg ? (
        <span className="mt-1 block max-w-52.5 text-right text-[11px] leading-5 text-red-400 max-md:max-w-45">
          {msg}
        </span>
      ) : null}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}