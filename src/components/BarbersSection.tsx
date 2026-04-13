import { BarberCard } from "@/components/BarberCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { BarberRow } from "@/types/database";

export function BarbersSection({ barbers }: { barbers: BarberRow[] }) {
  return (
    <section id="barbers" className="scroll-mt-24 border-b border-white/[0.06] py-20 sm:py-24">
      <Container>
        <SectionHeading
          kicker="الفريق"
          title="حلاقين بخبرة ولمسة عصرية"
          description="كل واحد فينا عنده ستايل مختلف — والنتيجة دايمًا شغل نظيف ومرتب."
        />
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {barbers.map((b, i) => (
            <BarberCard key={b.id} barber={b} index={i} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
