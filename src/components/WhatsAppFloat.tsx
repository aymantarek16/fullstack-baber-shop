"use client";

import { motion } from "framer-motion";

export function WhatsAppFloat({ phoneDigits }: { phoneDigits: string }) {
  const clean = phoneDigits.replace(/\D/g, "");
  if (!clean) return null;
  const href = `https://wa.me/${clean}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      initial={{ scale: 0.92, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.2 }}
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-5 end-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-[0_12px_40px_-8px_rgba(37,211,102,0.55)] ring-2 ring-white/15 sm:bottom-8 sm:end-8 sm:h-[3.75rem] sm:w-[3.75rem]"
    >
      <span className="sr-only">واتساب</span>
      <svg viewBox="0 0 32 32" className="h-8 w-8 fill-white" aria-hidden>
        <path d="M16.003 3C9.374 3 4 8.373 4 14.999c0 2.385.698 4.598 1.9 6.47L4 29l7.705-1.9A11.94 11.94 0 0016.003 27C22.629 27 28 21.627 28 14.999 28 8.373 22.629 3 16.003 3zm0 21.8c-2.15 0-4.17-.6-5.9-1.65l-.42-.25-4.35 1.07 1.08-4.24-.27-.44A9.77 9.77 0 016.2 15c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8zm5.6-6.9c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.08 2.89 1.23 3.09.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.44.25-.7.25-1.3.17-1.44-.08-.14-.27-.22-.57-.37z" />
      </svg>
    </motion.a>
  );
}
