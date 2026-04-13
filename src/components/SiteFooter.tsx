import Link from "next/link";
import { Container } from "@/components/ui/Container";

function waLink(phoneDigits: string) {
  const clean = phoneDigits.replace(/\D/g, "");
  if (!clean) return null;
  return `https://wa.me/${clean}`;
}

export function SiteFooter({ whatsappPhoneDigits = "" }: { whatsappPhoneDigits?: string }) {
  const wa = waLink(whatsappPhoneDigits);

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#080809]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-amber-500/25 to-transparent" />
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-700/10 ring-1 ring-amber-500/30">
                <span className="text-base font-black text-amber-400">✂</span>
              </span>
              <span className="text-lg font-bold text-white">Royal Barbers</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
              حجز أونلاين بسهولة — مواعيد واضحة، فريق محترف، وتجربة راقية من أول زيارة.
            </p>
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition hover:brightness-110"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                واتساب
              </a>
            ) : null}
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">روابط سريعة</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="#services" className="text-zinc-400 transition hover:text-amber-300">
                  الخدمات
                </a>
              </li>
              <li>
                <a href="#barbers" className="text-zinc-400 transition hover:text-amber-300">
                  الفريق
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-zinc-400 transition hover:text-amber-300">
                  المعرض
                </a>
              </li>
              <li>
                <a href="#booking" className="text-zinc-400 transition hover:text-amber-300">
                  احجز موعد
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">للإدارة</h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">دخول المشرفين فقط.</p>
            <Link
              href="/admin/login"
              className="mt-4 inline-flex text-sm font-semibold text-amber-500/90 transition hover:text-amber-400"
            >
              لوحة التحكم ←
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-center sm:flex-row sm:text-start">
          <p className="text-xs text-zinc-600">© {new Date().getFullYear()} صالون الحلاقة. جميع الحقوق محفوظة.</p>
          <p className="text-xs text-zinc-600">صُمم لتجربة حجز فاخرة على الموبايل والديسكتوب.</p>
        </div>
      </Container>
    </footer>
  );
}
