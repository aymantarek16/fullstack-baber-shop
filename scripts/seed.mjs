/**
 * Optional seed via Supabase API (bypasses RLS using service role).
 * Usage (Node 20+):
 *   node --env-file=.env.local scripts/seed.mjs
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Prefer running supabase/seed.sql in the SQL Editor if you avoid the service key locally.
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const barbers = [
  {
    name: "كريم",
    tagline: "قص كلاسيكي ولمسة عصرية ✂️",
    image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
    active: true,
  },
  {
    name: "عمر",
    tagline: "ذقن حادة وشغل نظيف 🔥",
    image_url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
    active: true,
  },
  {
    name: "يوسف",
    tagline: "اهتمام بالتفاصيل وخدمة VIP",
    image_url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80",
    active: true,
  },
];

const services = [
  { name: "قص شعر", price: 120, duration_minutes: 30 },
  { name: "تهذيب ذقن", price: 60, duration_minutes: 20 },
  { name: "باكيدج شعر + ذقن", price: 160, duration_minutes: 45 },
];

async function main() {
  const { count: bCount, error: bCountErr } = await supabase
    .from("barbers")
    .select("*", { count: "exact", head: true });
  if (bCountErr) {
    console.error("Barbers count failed:", bCountErr.message);
    process.exit(1);
  }
  if ((bCount ?? 0) === 0) {
    const { error } = await supabase.from("barbers").insert(barbers);
    if (error) {
      console.error("Barbers insert failed:", error.message);
      process.exit(1);
    }
    console.log("Inserted 3 barbers.");
  } else {
    console.log("Barbers already present, skipped.");
  }

  const { count: sCount, error: sCountErr } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true });
  if (sCountErr) {
    console.error("Services count failed:", sCountErr.message);
    process.exit(1);
  }
  if ((sCount ?? 0) === 0) {
    const { error } = await supabase.from("services").insert(services);
    if (error) {
      console.error("Services insert failed:", error.message);
      process.exit(1);
    }
    console.log("Inserted 3 services.");
  } else {
    console.log("Services already present, skipped.");
  }

  console.log("Done.");
}

await main();
