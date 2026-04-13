"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const FEATURE = {
  src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1400&q=80",
  alt: "قص شعر احترافي",
};

const GRID = [
  { src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=80", alt: "صالون عصري" },
  { src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=900&q=80", alt: "تفاصيل الدقة" },
  { src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=900&q=80", alt: "أدوات الحلاقة" },
  {
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80&auto=format&fit=crop",
    alt: "جلوس مريح",
  },
  { src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=900&q=80", alt: "لمسة نهائية" },
];

function GalleryImage({
  src,
  alt,
  className,
  sizes,
  delay = 0,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  delay?: number;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 1, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121215] ring-1 ring-white/[0.04] ${className ?? ""}`}
    >
      {!failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
          sizes={sizes}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950">
          <span className="px-4 text-center text-sm text-zinc-500">{alt}</span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-85 transition group-hover:opacity-95" />
      <div className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_0_1px_rgba(232,197,71,0.35)] transition group-hover:opacity-100" />
      <p className="absolute bottom-3 right-3 text-xs font-semibold text-white/95 drop-shadow sm:bottom-4 sm:right-4 sm:text-sm">
        {alt}
      </p>
    </motion.div>
  );
}

export function GallerySection() {
  return (
    <section id="gallery" className="scroll-mt-24 border-b border-white/[0.06] py-20 sm:py-24">
      <Container>
        <SectionHeading
          kicker="المعرض"
          title="لمحات من أجواء الصالون"
          description="إضاءة هادئة، تفاصيل مضبوطة، وشغل يتكلم عن نفسه."
          align="center"
        />

        <div className="mt-14 space-y-4 sm:space-y-5">
          <GalleryImage
            src={FEATURE.src}
            alt={FEATURE.alt}
            className="relative h-[220px] w-full sm:h-[300px] lg:h-[380px]"
            sizes="(max-width: 768px) 100vw, 1200px"
            delay={0}
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {GRID.map((item, i) => (
              <GalleryImage
                key={item.src}
                src={item.src}
                alt={item.alt}
                className="relative aspect-[4/3]"
                sizes="(max-width: 640px) 50vw, 33vw"
                delay={0.04 * (i + 1)}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
