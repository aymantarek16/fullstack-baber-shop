"use client";

import { useRef, useState } from "react";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface DeleteAllBookingsDialogProps {
  action: (formData?: FormData) => Promise<unknown>;
}

export function DeleteAllBookingsDialog({ action }: DeleteAllBookingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    if (isDeleting) return;
    setIsOpen(false);
  }

  function confirmDelete() {
    if (isDeleting) return;
    setIsDeleting(true);
    formRef.current?.requestSubmit();
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex h-11 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10 px-5 text-sm font-black text-red-300 transition hover:border-red-500/40 hover:bg-red-500/15"
      >
        حذف كل الحجوزات
      </button>

      <ConfirmDeleteModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="تأكيد حذف كل الحجوزات"
        description="سيتم حذف كل الحجوزات نهائيًا. هذا إجراء نهائي ولا يمكن التراجع عنه.
        تأكد قبل الموافقة على الحذف."
        confirmLabel="تأكيد الحذف"
        cancelLabel="إلغاء"
      />

      <form ref={formRef} action={action} className="hidden" />
    </>
  );
}
