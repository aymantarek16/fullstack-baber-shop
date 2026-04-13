-- Seed: 3 barbers + 3 services (safe to run once; skips if data exists)
-- Run AFTER schema.sql in SQL Editor

INSERT INTO public.barbers (name, tagline, image_url, active)
SELECT name, tagline, image_url, active
FROM (
  VALUES
    (
      'كريم',
      'قص كلاسيكي ولمسة عصرية ✂️',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
      TRUE
    ),
    (
      'عمر',
      'ذقن حادة وشغل نظيف 🔥',
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80',
      TRUE
    ),
    (
      'يوسف',
      'اهتمام بالتفاصيل وخدمة VIP',
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80',
      TRUE
    )
) AS v(name, tagline, image_url, active)
WHERE NOT EXISTS (SELECT 1 FROM public.barbers LIMIT 1);

INSERT INTO public.services (name, price, duration_minutes)
SELECT name, price, duration_minutes
FROM (
  VALUES
    ('قص شعر', 120.00::NUMERIC, 30),
    ('تهذيب ذقن', 60.00::NUMERIC, 20),
    ('باكيدج شعر + ذقن', 160.00::NUMERIC, 45)
) AS s(name, price, duration_minutes)
WHERE NOT EXISTS (SELECT 1 FROM public.services LIMIT 1);
