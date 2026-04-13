import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BookingMobileCard } from "@/components/admin/BookingMobileCard";
import { BookingRowActions } from "@/components/admin/BookingRowActions";
import { DeleteAllBookingsDialog } from "@/components/admin/DeleteAllBookingsDialog";
import { Container } from "@/components/ui/Container";
import { deleteAllBookings } from "@/app/actions/admin";
import type { BookingStatus, BookingWithRelations } from "@/types/database";

function badgeClass(status: BookingStatus) {
  switch (status) {
    case "pending":
      return "border border-amber-400/20 bg-amber-500/12 text-amber-200 ring-1 ring-amber-500/20";
    case "confirmed":
      return "border border-sky-400/20 bg-sky-500/12 text-sky-200 ring-1 ring-sky-500/20";
    case "cancelled":
      return "border border-zinc-400/15 bg-zinc-500/10 text-zinc-300 ring-1 ring-zinc-500/15";
    case "done":
      return "border border-emerald-400/20 bg-emerald-500/12 text-emerald-200 ring-1 ring-emerald-500/20";
    default:
      return "border border-zinc-400/15 bg-zinc-500/10 text-zinc-300";
  }
}

const statusLabel: Record<BookingStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  cancelled: "ملغي",
  done: "تم",
};

const filterInputClass =
  "min-h-[46px] w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-zinc-600 focus:border-amber-500/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-amber-500/10";

const filterSelectClass =
  "min-h-[46px] w-full appearance-none rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 pr-10 text-right text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition focus:border-amber-500/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-amber-500/10";

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

const PAGE_SIZE = 10;

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
    neutral:
      "border-white/[0.08] bg-gradient-to-br from-white/[0.05] via-white/[0.025] to-transparent text-white",
    amber:
      "border-amber-500/15 bg-gradient-to-br from-amber-500/12 via-amber-500/[0.04] to-transparent text-amber-100",
    sky: "border-sky-500/15 bg-gradient-to-br from-sky-500/12 via-sky-500/[0.04] to-transparent text-sky-100",
    emerald:
      "border-emerald-500/15 bg-gradient-to-br from-emerald-500/12 via-emerald-500/[0.04] to-transparent text-emerald-100",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.03] backdrop-blur-sm ${accents[accent]}`}
    >
      <div className="pointer-events-none absolute -left-10 top-0 h-24 w-24 rounded-full bg-white/[0.03] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-white/[0.025] blur-2xl" />

      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black leading-none tracking-tight tabular-nums sm:text-[2rem]">
        {value}
      </p>
    </div>
  );
}

function buildAdminPageHref(
  params: {
    date?: string;
    barber?: string;
    status?: string;
  },
  page: number
) {
  const query = new URLSearchParams();

  if (params.date) query.set("date", params.date);
  if (params.barber) query.set("barber", params.barber);
  if (params.status) query.set("status", params.status);
  if (page > 1) query.set("page", String(page));

  const qs = query.toString();
  return qs ? `/admin?${qs}` : "/admin";
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 1) return [1];

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);

  for (let i = currentPage - 1; i <= currentPage + 1; i += 1) {
    if (i >= 1 && i <= totalPages) {
      pages.add(i);
    }
  }

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i += 1) {
      pages.add(i);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

function Pagination({
  currentPage,
  totalPages,
  params,
}: {
  currentPage: number;
  totalPages: number;
  params: {
    date?: string;
    barber?: string;
    status?: string;
  };
}) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.02] px-4 py-4 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.04] backdrop-blur-sm sm:flex-row">
      <div className="text-sm text-zinc-400">
        صفحة <span className="font-extrabold text-white">{currentPage}</span> من{" "}
        <span className="font-extrabold text-white">{totalPages}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link
          href={buildAdminPageHref(params, currentPage - 1)}
          aria-disabled={currentPage <= 1}
          className={`inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition ${currentPage <= 1
              ? "pointer-events-none border-white/10 bg-white/[0.025] text-zinc-600"
              : "border-white/10 bg-white/[0.045] text-zinc-300 hover:border-white/15 hover:bg-white/[0.07]"
            }`}
        >
          السابق
        </Link>

        {pages.map((page, index) => {
          const prevPage = pages[index - 1];
          const showDots = index > 0 && page - prevPage > 1;

          return (
            <div key={page} className="flex items-center gap-2">
              {showDots ? (
                <span className="px-1 text-sm font-semibold text-zinc-600">...</span>
              ) : null}

              <Link
                href={buildAdminPageHref(params, page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-2xl border px-3 text-sm font-extrabold transition ${page === currentPage
                    ? "border-amber-400/40 bg-gradient-to-r from-amber-300 to-amber-500 text-zinc-950 shadow-[0_12px_30px_-12px_rgba(245,158,11,0.7)]"
                    : "border-white/10 bg-white/[0.045] text-zinc-300 hover:border-white/15 hover:bg-white/[0.07]"
                  }`}
              >
                {page}
              </Link>
            </div>
          );
        })}

        <Link
          href={buildAdminPageHref(params, currentPage + 1)}
          aria-disabled={currentPage >= totalPages}
          className={`inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition ${currentPage >= totalPages
              ? "pointer-events-none border-white/10 bg-white/[0.025] text-zinc-600"
              : "border-white/10 bg-white/[0.045] text-zinc-300 hover:border-white/15 hover:bg-white/[0.07]"
            }`}
        >
          التالي
        </Link>
      </div>
    </div>
  );
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    date?: string;
    barber?: string;
    status?: string;
    page?: string;
  }>;
}) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    redirect("/admin/login");
  }

  const sp = await searchParams;
  const supabase = await createClient();

  const currentPageRaw = Number(sp.page ?? "1");
  const currentPage =
    Number.isFinite(currentPageRaw) && currentPageRaw > 0
      ? Math.floor(currentPageRaw)
      : 1;

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
      `id, customer_name, phone, barber_id, service_id, booking_date, booking_time, notes, status, created_at, barber:barbers(name), service:services(name, price, duration_minutes)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (sp.date) {
    query = query.eq("booking_date", sp.date);
  }

  if (sp.barber) {
    query = query.eq("barber_id", sp.barber);
  }

  if (
    sp.status &&
    ["pending", "confirmed", "cancelled", "done"].includes(sp.status)
  ) {
    query = query.eq("status", sp.status as BookingStatus);
  }

  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  query = query.range(from, to);

  const { data: bookings, error: bookingsError, count } = await query;

  const totalFilteredRows = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalFilteredRows / PAGE_SIZE));

  if (currentPage > totalPages && totalFilteredRows > 0) {
    redirect(
      buildAdminPageHref(
        {
          date: sp.date,
          barber: sp.barber,
          status: sp.status,
        },
        totalPages
      )
    );
  }

  const [totalC, pendingC, confirmedC, doneC] = await Promise.all(
    (["", "pending", "confirmed", "done"] as const).map((st) => {
      let q = supabase
        .from("bookings")
        .select("*", { count: "exact", head: true });

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

  const activeFilters = {
    date: sp.date,
    barber: sp.barber,
    status: sp.status,
  };

  return (
    <>
      <AdminHeader />

      <main className="pb-16 pt-6 sm:pt-8" dir="rtl">
        <Container>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <StatCard label="كل الحجوزات" value={stats.total} accent="neutral" />
            <StatCard label="قيد الانتظار" value={stats.pending} accent="amber" />
            <StatCard label="مؤكد" value={stats.confirmed} accent="sky" />
            <StatCard label="تم التنفيذ" value={stats.done} accent="emerald" />
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <form
              method="get"
              className="flex flex-col gap-4 rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.045] via-white/[0.025] to-white/[0.015] p-4 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.95)] ring-1 ring-white/[0.04] backdrop-blur-sm sm:flex-row sm:flex-wrap sm:items-end"
            >
              <label className="flex min-w-[160px] flex-1 flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">
                  التاريخ
                </span>
                <input
                  dir="rtl"
                  type="date"
                  name="date"
                  defaultValue={sp.date ?? ""}
                  className={filterInputClass}
                />
              </label>

              <label className="flex min-w-[180px] flex-1 flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">
                  الحلاق
                </span>
                <div className="relative">
                  <select
                    dir="rtl"
                    name="barber"
                    defaultValue={sp.barber ?? ""}
                    className={filterSelectClass}
                  >
                    <option value="" style={{ color: "#0f172a" }}>
                      الكل
                    </option>
                    {(barbers ?? []).map((b) => (
                      <option key={b.id} value={b.id} style={{ color: "#0f172a" }}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-white/60">
                    ▼
                  </span>
                </div>
              </label>

              <label className="flex min-w-[160px] flex-1 flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">
                  الحالة
                </span>
                <div className="relative">
                  <select
                    dir="rtl"
                    name="status"
                    defaultValue={sp.status ?? ""}
                    className={filterSelectClass}
                  >
                    <option value="" style={{ color: "#0f172a" }}>
                      الكل
                    </option>
                    <option value="pending" style={{ color: "#0f172a" }}>
                      قيد الانتظار
                    </option>
                    <option value="confirmed" style={{ color: "#0f172a" }}>
                      مؤكد
                    </option>
                    <option value="cancelled" style={{ color: "#0f172a" }}>
                      ملغي
                    </option>
                    <option value="done" style={{ color: "#0f172a" }}>
                      تم
                    </option>
                  </select>
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-white/60">
                    ▼
                  </span>
                </div>
              </label>

              <div className="flex w-full flex-col gap-2 sm:ms-auto sm:w-auto sm:flex-row sm:flex-wrap">
                <button
                  type="submit"
                  className="inline-flex min-h-[46px] items-center justify-center rounded-2xl bg-gradient-to-r from-amber-300 to-amber-500 px-6 text-sm font-black text-zinc-950 shadow-[0_14px_32px_-14px_rgba(245,158,11,0.75)] transition hover:scale-[0.99] hover:opacity-95"
                >
                  تطبيق
                </button>

                <Link
                  href="/admin"
                  className="inline-flex min-h-[46px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-5 text-sm font-bold text-zinc-300 transition hover:border-white/15 hover:bg-white/[0.07]"
                >
                  إعادة ضبط
                </Link>

                {rows.length > 0 ? (
                  <DeleteAllBookingsDialog formId="delete-all-bookings-form" />
                ) : null}
              </div>
            </form>
            <form
              id="delete-all-bookings-form"
              action={deleteAllBookings}
              className="hidden"
            />
          </div>

          {!bookingsError && rows.length > 0 ? (
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-zinc-400 ring-1 ring-white/[0.03] sm:flex-row sm:items-center sm:justify-between">
              <p>
                إجمالي النتائج:{" "}
                <span className="font-extrabold text-white">{totalFilteredRows}</span>
              </p>

              <p>
                عرض{" "}
                <span className="font-extrabold text-white">{from + 1}</span> -{" "}
                <span className="font-extrabold text-white">
                  {Math.min(from + rows.length, totalFilteredRows)}
                </span>
              </p>
            </div>
          ) : null}

          {bookingsError ? (
            <div className="mt-10 rounded-3xl border border-red-500/25 bg-red-500/10 p-8 text-center shadow-[0_20px_60px_-30px_rgba(127,29,29,0.9)] ring-1 ring-red-500/10">
              <p className="font-bold text-red-300">تعذر تحميل الحجوزات</p>
              <p className="mt-2 text-sm text-red-400/80">
                تحقق من الاتصال أو صلاحيات الحساب.
              </p>
            </div>
          ) : rows.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-white/12 bg-white/[0.02] px-8 py-16 text-center ring-1 ring-white/[0.03]">
              <p className="text-lg font-bold text-zinc-300">لا توجد حجوزات مطابقة</p>
              <p className="mt-2 text-sm text-zinc-600">
                جرّب تغيير الفلاتر أو أعد ضبط البحث.
              </p>
              <Link
                href="/admin"
                className="mt-6 inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-sm font-bold text-amber-200 transition hover:bg-amber-500/15"
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

              <div className="mt-8 hidden overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#09090b]/95 shadow-[0_28px_80px_-35px_rgba(0,0,0,0.95)] ring-1 ring-white/[0.04] lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1120px] text-sm">
                    <thead className="border-b border-white/[0.07] bg-white/[0.025]">
                      <tr className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-zinc-500">
                        {headers.map((header) => (
                          <th
                            key={header}
                            className={`${thClass} ${header === "ملاحظات"
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
                        <tr
                          key={b.id}
                          className="transition duration-200 hover:bg-white/[0.03]"
                        >
                          <td className={`${tdClass} text-center font-bold text-white`}>
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

                          <td
                            className={`${tdClass} whitespace-nowrap text-center text-zinc-500`}
                          >
                            {b.booking_date}
                          </td>

                          <td
                            className={`${tdClass} whitespace-nowrap text-center text-zinc-500`}
                          >
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
                              className={`inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold tracking-[0.12em] ${badgeClass(
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

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                params={activeFilters}
              />
            </>
          )}

          <p className="mt-8 text-center text-[11px] text-zinc-600">
            لو عدّلت من تبويب تاني، اعمل ريفريش عشان التحديث يظهر
          </p>
        </Container>
      </main>
    </>
  );
}