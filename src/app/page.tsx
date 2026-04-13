import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { BarbersSection } from "@/components/BarbersSection";
import { BookingForm } from "@/components/BookingForm";
import { EnvMissing } from "@/components/EnvMissing";
import { GallerySection } from "@/components/GallerySection";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";

function ErrorScreen({
  title,
  body,
  codeHint,
}: {
  title: string;
  body: ReactNode;
  codeHint?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0c0c0e] px-4 py-16">
      <Container className="max-w-lg text-center">
        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-10 ring-1 ring-white/[0.05]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl ring-1 ring-red-500/25">
            !
          </div>
          <h1 className="mt-6 text-lg font-bold text-white sm:text-xl">{title}</h1>
          <div className="mt-3 text-sm leading-relaxed text-zinc-400">{body}</div>
          {codeHint ? (
            <p className="mt-4 font-mono text-xs text-zinc-500">
              <code className="rounded bg-black/40 px-2 py-1 text-amber-200/80">{codeHint}</code>
            </p>
          ) : null}
        </div>
      </Container>
    </div>
  );
}

export default async function Home() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <EnvMissing />;
  }

  const supabase = await createClient();
  const [{ data: barbers, error: barbersError }, { data: services, error: servicesError }] =
    await Promise.all([
      supabase.from("barbers").select("*").eq("active", true).order("created_at", { ascending: true }),
      supabase.from("services").select("*").order("created_at", { ascending: true }),
    ]);

  if (barbersError || servicesError) {
    return (
      <ErrorScreen
        title="تعذر الاتصال بقاعدة البيانات"
        body={
          <>
            تأكد من تشغيل SQL في Supabase وتفعيل RLS كما في الملف{" "}
            <span className="text-zinc-300">supabase/schema.sql</span>.
          </>
        }
      />
    );
  }

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_PHONE ?? "";
  const hasWhatsAppConfig = Boolean(wa.replace(/\D/g, ""));

  if (!barbers?.length || !services?.length) {
    return (
      <ErrorScreen
        title="مفيش بيانات في الجداول"
        body={
          <>
            نفّذ{" "}
            <span className="text-zinc-300">supabase/seed.sql</span> من SQL Editor بعد إنشاء الجداول، أو شغّل{" "}
            <span className="text-zinc-300">npm run seed</span> محليًا (مع مفتاح الخدمة كما في README).
          </>
        }
        codeHint="supabase/seed.sql"
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="relative z-0 w-full flex-1 grow">
        <HeroSection />
        <ServicesSection services={services} />
        <BarbersSection barbers={barbers} />
        <GallerySection />
        <BookingForm barbers={barbers} services={services} hasWhatsAppConfig={hasWhatsAppConfig} />
      </main>
      <SiteFooter whatsappPhoneDigits={wa} />
      <WhatsAppFloat phoneDigits={wa} />
    </div>
  );
}
