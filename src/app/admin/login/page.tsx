import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/admin/LoginForm";
import { Container } from "@/components/ui/Container";

export default async function AdminLoginPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="max-w-md rounded-3xl border border-amber-500/25 bg-white/[0.03] p-8 text-center ring-1 ring-white/[0.06]">
          <p className="text-amber-200">أضف مفاتيح Supabase في .env.local</p>
          <Link href="/" className="mt-6 inline-block text-sm font-medium text-zinc-500 hover:text-zinc-300">
            العودة للموقع
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (isAdmin) {
      redirect("/admin");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Container className="flex max-w-[440px] flex-col">
        <div className="rounded-3xl border border-white/[0.1] bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 shadow-[0_32px_100px_-48px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.06]">
          <div className="rounded-t-3xl border-b border-white/[0.08] bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent px-8 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-lg font-black text-amber-300 ring-1 ring-amber-400/40">
              A
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-white">لوحة التحكم</h1>
            <p className="mt-2 text-sm text-zinc-400">تسجيل دخول المشرفين فقط</p>
          </div>
          <div className="relative px-8 py-8 pb-10">
            <LoginForm />
          </div>
        </div>
        <Link
          href="/"
          className="mt-8 text-center text-sm font-medium text-zinc-600 transition hover:text-zinc-400"
        >
          ← الموقع العام
        </Link>
      </Container>
    </div>
  );
}
