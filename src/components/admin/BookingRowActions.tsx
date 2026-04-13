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
  "h-11 w-[170px] rounded-2xl border border-white/10 bg-zinc-950/90 px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/15 disabled:cursor-not-allowed disabled:opacity-50";

const deleteBtnClass =
  "h-11 w-[170px] rounded-2xl border border-red-500/30 bg-red-500/10 px-4 text-sm font-bold text-red-300 transition hover:bg-red-500/15 hover:border-red-500/45 disabled:cursor-not-allowed disabled:opacity-50";

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

  async function onDelete() {
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
    <div className="flex min-w-[170px] flex-col items-end justify-center gap-3 py-1">
      <div className="relative w-[170px]">
        <select
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
      </div>

      <button
        type="button"
        disabled={pending || isDeleting}
        onClick={() => void onDelete()}
        className={deleteBtnClass}
      >
        {isDeleting ? "جاري الحذف..." : "حذف الحجز"}
      </button>

      {msg ? (
        <span className="max-w-[170px] text-right text-[11px] leading-5 text-red-400">
          {msg}
        </span>
      ) : null}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}