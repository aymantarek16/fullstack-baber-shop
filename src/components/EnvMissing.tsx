import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function EnvMissing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0c0c0e] px-4 py-16">
      <Container className="max-w-lg text-center">
        <div className="rounded-3xl border border-amber-500/25 bg-gradient-to-b from-amber-500/[0.08] to-white/[0.02] p-10 shadow-[0_32px_80px_-40px_rgba(245,197,66,0.35)] ring-1 ring-white/[0.06]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-2xl ring-1 ring-amber-400/30">
            ⚙
          </span>
          <h1 className="mt-6 text-xl font-bold text-white sm:text-2xl">إعدادات Supabase ناقصة</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            أنشئ ملف{" "}
            <code className="rounded-md bg-black/50 px-2 py-0.5 text-xs text-amber-200/90 ring-1 ring-white/10">.env.local</code>{" "}
            من{" "}
            <code className="rounded-md bg-black/50 px-2 py-0.5 text-xs text-amber-200/90 ring-1 ring-white/10">.env.example</code>{" "}
            والصق مفاتيح المشروع من لوحة Supabase.
          </p>
          <Link
            href="https://supabase.com/dashboard"
            className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
          >
            فتح Supabase
          </Link>
        </div>
      </Container>
    </div>
  );
}
