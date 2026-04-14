"use client";

import { useEffect, useState } from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  title = "تأكيد حذف الحجز",
  description = "هل أنت متأكد أنك تريد حذف هذا الحجز نهائيًا؟ لا يمكن التراجع بعد الحذف.",
  confirmLabel = "تأكيد الحذف",
  cancelLabel = "إلغاء",
}: ConfirmDeleteModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const shouldRender = isOpen || isVisible;

  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => {
        setIsVisible(true);
      });

      return () => cancelAnimationFrame(frame);
    }

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [shouldRender, isDeleting, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-description"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-3xl border border-white/12 bg-linear-to-br from-zinc-900 via-zinc-950 to-black shadow-2xl shadow-black/50 ring-1 ring-white/8 transition-all duration-300 ease-out will-change-transform ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-6 scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/8 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/20 text-red-400">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <div>
            <h2 id="confirm-delete-title" className="text-lg font-bold text-white">
              {title}
            </h2>
            <p className="text-sm text-zinc-400">إجراء خطير</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p
            id="confirm-delete-description"
            className="text-right text-sm font-medium leading-6 text-zinc-300"
          >
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t border-white/8 px-6 py-5 sm:flex-row-reverse">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-red-500 to-red-600 px-4 text-sm font-bold text-white shadow-lg shadow-red-900/25 transition-all duration-200 hover:from-red-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:flex-none sm:px-6"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                جاري الحذف...
              </>
            ) : (
              confirmLabel
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex h-11 flex-1 items-center justify-center rounded-2xl border border-white/15 bg-white/4 px-4 text-sm font-semibold text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-200 hover:border-white/25 hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-6"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}