"use client";

import { useState } from "react";
import { signInAdmin } from "@/app/actions/admin";

const labelClass = "block text-xs font-semibold uppercase tracking-wider text-zinc-400";
const inputClass =
  "mt-2 w-full min-h-[48px] rounded-xl border border-white/[0.12] bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 shadow-inner shadow-black/20 outline-none ring-0 transition placeholder:text-zinc-600 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/25";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await signInAdmin(fd);
      if (res && !res.ok) {
        setError(res.error);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} method="POST" className="space-y-5">
      <div>
        <label htmlFor="admin-email" className={labelClass}>
          البريد الإلكتروني
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
          placeholder="admin@example.com"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className={labelClass}>
          كلمة المرور
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
          placeholder="••••••••"
        />
      </div>
      {error ? (
        <p
          className="rounded-xl border border-red-500/40 bg-red-500/15 px-3 py-2.5 text-sm text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-900/35 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {pending ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950/40 border-t-zinc-950"
              aria-hidden
            />
            جاري الدخول…
          </>
        ) : (
          "دخول"
        )}
      </button>
    </form>
  );
}
