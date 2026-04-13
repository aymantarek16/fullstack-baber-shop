import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BookingMobileCard } from "@/components/admin/BookingMobileCard";
import { BookingRowActions } from "@/components/admin/BookingRowActions";
import { Container } from "@/components/ui/Container";
import type { BookingStatus, BookingWithRelations } from "@/types/database";

function badgeClass(status: BookingStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-500/15 text-amber-200 ring-amber-500/35";
    case "confirmed":
      return "bg-sky-500/15 text-sky-200 ring-sky-500/35";
    case "cancelled":
      return "bg-zinc-500/15 text-zinc-300 ring-zinc-500/30";
    case "done":
      return "bg-emerald-500/15 text-emerald-200 ring-emerald-500/35";
    default:
      return "bg-zinc-500/15 text-zinc-300";
  }
}

const statusLabel: Record<BookingStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  cancelled: "ملغي",
  done: "تم",
};

const filterInputClass =
  "min-h-[44px] rounded-xl border border-white/[0.1] bg-black/45 px-3 py-2 text-sm text-white outline-none transition focus:border-amber-500/45";

const thClass = "px-4 py-4 text-center";
const tdClass = "px-4 py-4 align-middle";
const headers = [
  "العميل",
  "الهاتف",
  "الخدمة",
  "الحلاق",
  "التاريخ",
  "الوقت",
  "ملاحظات",
  "الحالة",
  "إجراءات",
];

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "neutral" | "amber" | "sky" | "emerald";
}) {
  const accents = {
    neutral: "from-white/[0.07] to-transparent text-white",
    amber: "from-amber-500/12 to-transparent text-amber-200",
    sky: "from-sky-500/12 to-transparent text-sky-200",
    emerald: "from-emerald-500/12 to-transparent text-emerald-200",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br p-5 shadow-lg shadow-black/30 ring-1 ring-white/[0.04] ${accents[accent]}`}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/[0.04] blur-2xl" />
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black tabular-nums tracking-tight">
        {value}
      </p>
    </div>
  );
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; barber?: string; status?: string }>;
}) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    redirect("/admin/login");
  }

  const sp = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error: adminErr } = await supabase.rpc("is_admin");

  if (adminErr || !isAdmin) {
    redirect("/admin/login");
  }

  const { data: barbers } = await supabase
    .from("barbers")
    .select("id, name")
    .order("name", { ascending: true });

  let query = supabase
    .from("bookings")
    .select(
      `id, customer_name, phone, barber_id, service_id, booking_date, booking_time, notes, status, created_at, barber:barbers(name), service:services(name, price, duration_minutes)`
    )
    .order("created_at", { ascending: false });

  if (sp.date) {
    query = query.eq("booking_date", sp.date);
  }

  if (sp.barber) {
    query = query.eq("barber_id", sp.barber);
  }

  if (sp.status && ["pending", "confirmed", "cancelled", "done"].includes(sp.status)) {
    query = query.eq("status", sp.status as BookingStatus);
  }

  const { data: bookings, error: bookingsError } = await query;

  const [totalC, pendingC, confirmedC, doneC] = await Promise.all(
    (["", "pending", "confirmed", "done"] as const).map((st) => {
      let q = supabase.from("bookings").select("*", { count: "exact", head: true });
      if (st) {
        q = q.eq("status", st);
      }
      return q;
    })
  );

  const stats = {
    total: totalC.count ?? 0,
    pending: pendingC.count ?? 0,
    confirmed: confirmedC.count ?? 0,
    done: doneC.count ?? 0,
  };

  const rows = (bookings ?? []) as unknown as BookingWithRelations[];

  return (
    <>
      <AdminHeader />

      <main className="pb-16 pt-6 sm:pt-8">
        <Container>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <StatCard label="كل الحجوزات" value={stats.total} accent="neutral" />
            <StatCard label="قيد الانتظار" value={stats.pending} accent="amber" />
            <StatCard label="مؤكد" value={stats.confirmed} accent="sky" />
            <StatCard label="تم التنفيذ" value={stats.done} accent="emerald" />
          </div>

          <form
            method="get"
            className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-4 shadow-xl shadow-black/40 ring-1 ring-white/[0.04] sm:flex-row sm:flex-wrap sm:items-end"
          >
            <label className="flex min-w-[160px] flex-1 flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                التاريخ
              </span>
              <input
                type="date"
                name="date"
                defaultValue={sp.date ?? ""}
                className={filterInputClass}
              />
            </label>

            <label className="flex min-w-[180px] flex-1 flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                الحلاق
              </span>
              <select
                name="barber"
                defaultValue={sp.barber ?? ""}
                className={filterInputClass}
              >
                <option value="">الكل</option>
                {(barbers ?? []).map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex min-w-[160px] flex-1 flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                الحالة
              </span>
              <select
                name="status"
                defaultValue={sp.status ?? ""}
                className={filterInputClass}
              >
                <option value="">الكل</option>
                <option value="pending">قيد الانتظار</option>
                <option value="confirmed">مؤكد</option>
                <option value="cancelled">ملغي</option>
                <option value="done">تم</option>
              </select>
            </label>

            <div className="flex flex-wrap gap-2 sm:ms-auto">
              <button
                type="submit"
                className="min-h-[44px] flex-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-6 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-900/25 transition hover:opacity-95 sm:flex-none"
              >
                تطبيق
              </button>

              <Link
                href="/admin"
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.07] sm:flex-none"
              >
                إعادة ضبط
              </Link>
            </div>
          </form>

          {bookingsError ? (
            <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
              <p className="font-semibold text-red-300">تعذر تحميل الحجوزات</p>
              <p className="mt-2 text-sm text-red-400/80">
                تحقق من الاتصال أو صلاحيات الحساب.
              </p>
            </div>
          ) : rows.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-16 text-center">
              <p className="text-lg font-semibold text-zinc-300">لا توجد حجوزات مطابقة</p>
              <p className="mt-2 text-sm text-zinc-600">
                جرّب تغيير الفلاتر أو أعد ضبط البحث.
              </p>
              <Link
                href="/admin"
                className="mt-6 inline-flex rounded-full border border-amber-500/35 bg-amber-500/10 px-5 py-2 text-sm font-semibold text-amber-200"
              >
                عرض كل الحجوزات
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-8 space-y-4 lg:hidden">
                {rows.map((b) => (
                  <BookingMobileCard key={b.id} b={b} />
                ))}
              </div>

              <div className="mt-8 hidden overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0c] shadow-2xl shadow-black/50 ring-1 ring-white/[0.04] lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1120px] text-sm">
                    <thead className="border-b border-white/[0.08] bg-black/40">
                      <tr className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        {headers.map((header) => (
                          <th
                            key={header}
                            className={`${thClass} ${
                              header === "ملاحظات"
                                ? "max-w-[160px]"
                                : header === "إجراءات"
                                ? "min-w-[220px]"
                                : ""
                            }`}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/[0.05]">
                      {rows.map((b) => (
                        <tr key={b.id} className="transition hover:bg-white/[0.02]">
                          <td className={`${tdClass} text-center font-semibold text-white`}>
                            {b.customer_name}
                          </td>

                          <td
                            className={`${tdClass} whitespace-nowrap text-center font-mono text-sm text-zinc-400`}
                            dir="ltr"
                          >
                            {b.phone}
                          </td>

                          <td className={`${tdClass} text-center text-zinc-300`}>
                            {b.service?.name ?? "—"}
                          </td>

                          <td className={`${tdClass} text-center text-zinc-300`}>
                            {b.barber?.name ?? "—"}
                          </td>

                          <td className={`${tdClass} whitespace-nowrap text-center text-zinc-500`}>
                            {b.booking_date}
                          </td>

                          <td className={`${tdClass} whitespace-nowrap text-center text-zinc-500`}>
                            {b.booking_time}
                          </td>

                          <td
                            className={`${tdClass} max-w-[180px] truncate text-center text-xs text-zinc-500`}
                            title={b.notes ?? ""}
                          >
                            {b.notes?.trim() ? b.notes : "—"}
                          </td>

                          <td className={`${tdClass} text-center`}>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${badgeClass(
                                b.status
                              )}`}
                            >
                              {statusLabel[b.status]}
                            </span>
                          </td>

                          <td className={`${tdClass} min-w-[220px] text-center`}>
                            <div className="flex justify-center">
                              <BookingRowActions
                                bookingId={b.id}
                                currentStatus={b.status}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <p className="mt-8 text-center text-[11px] text-zinc-600">
            لتحديث القائمة بعد تعديل من تبويب آخر، استخدم تحديث الصفحة.
          </p>
        </Container>
      </main>
    </>
  );
}