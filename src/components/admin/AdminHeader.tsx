import Link from "next/link";
import { signOutAdmin } from "@/app/actions/admin";
import { Container } from "@/components/ui/Container";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[rgba(7,7,8,0.72)] backdrop-blur-2xl backdrop-saturate-150">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />
      <Container className="relative flex h-[72px] items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.9)]" />
            <p className="text-[10px] font-extrabold uppercase tracking-[0.32em] text-amber-400/90">
              Admin Panel
            </p>
          </div>

          <h1 className="truncate text-xl font-black tracking-tight text-white sm:text-[1.65rem]">
            لوحة الحجوزات
          </h1>
       
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="group hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-200 hover:border-white/20 hover:bg-white/[0.07] hover:text-white sm:inline-flex"
          >
            <span className="text-base transition group-hover:-translate-x-0.5">↗</span>
            الموقع
          </Link>

          <Link
            href="/"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white sm:hidden"
            aria-label="العودة إلى الموقع"
          >
            🏠
          </Link>

          <form action={signOutAdmin}>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 px-5 text-sm font-black text-[#18120a] shadow-[0_10px_30px_rgba(245,158,11,0.28)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(245,158,11,0.34)] active:translate-y-0"
            >
              خروج
            </button>
          </form>
        </div>
      </Container>
    </header>
  );
}