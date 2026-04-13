"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { createClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/types/database";

type ActionError = { ok: false; error: string };

async function requireAdminSession() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

  if (adminError || !isAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return supabase;
}

export async function signInAdmin(
  formData: FormData
): Promise<ActionError | void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      ok: false,
      error: "البريد الإلكتروني وكلمة المرور مطلوبين",
    };
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const msg = error.message.toLowerCase();

      if (msg.includes("invalid login credentials")) {
        return {
          ok: false,
          error: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        };
      }

      if (msg.includes("email not confirmed")) {
        return {
          ok: false,
          error: "البريد الإلكتروني غير مؤكد. فعّل الحساب أولاً",
        };
      }

      if (msg.includes("too many requests") || msg.includes("rate limit")) {
        return {
          ok: false,
          error: "محاولات كثيرة. جرّب بعد شوية",
        };
      }

      console.error("signInWithPassword error:", error);
      return {
        ok: false,
        error: "تعذر تسجيل الدخول",
      };
    }

    if (!data.user) {
      return {
        ok: false,
        error: "فشل الحصول على بيانات المستخدم",
      };
    }

    if (!data.user.email_confirmed_at) {
      await supabase.auth.signOut();
      return {
        ok: false,
        error: "البريد الإلكتروني غير مؤكد. فعّل الحساب أولاً",
      };
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

    if (adminError) {
      console.error("is_admin rpc error:", adminError);
      await supabase.auth.signOut();

      return {
        ok: false,
        error: "مشكلة في التحقق من صلاحية الأدمن",
      };
    }

    if (!isAdmin) {
      await supabase.auth.signOut();
      return {
        ok: false,
        error: "هذا الحساب غير مصرح له بدخول لوحة التحكم",
      };
    }

    revalidatePath("/admin");
    redirect("/admin");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error("Unexpected signInAdmin error:", error);

    try {
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.error("signOut after failure error:", signOutError);
    }

    return {
      ok: false,
      error: "حدث خطأ غير متوقع",
    };
  }
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/admin");
  redirect("/admin/login");
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
) {
  const supabase = await requireAdminSession();

  const allowed: BookingStatus[] = [
    "pending",
    "confirmed",
    "cancelled",
    "done",
  ];

  if (!allowed.includes(status)) {
    return { ok: false as const, error: "حالة غير صالحة" };
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);

  if (error) {
    console.error("updateBookingStatus error:", error);
    return { ok: false as const, error: "تعذر التحديث" };
  }

  revalidatePath("/admin");
  return { ok: true as const };
}

export async function deleteBooking(bookingId: string) {
  const supabase = await requireAdminSession();

  const { error } = await supabase.from("bookings").delete().eq("id", bookingId);

  if (error) {
    console.error("deleteBooking error:", error);
    return { ok: false as const, error: "تعذر الحذف" };
  }

  revalidatePath("/admin");
  return { ok: true as const };
}

export async function deleteAllBookings() {
  const supabase = await requireAdminSession();

  const { error } = await supabase
    .from("bookings")
    .delete()
    .not("id", "is", null);

  if (error) {
    console.error("deleteAllBookings error:", error);
    return { ok: false as const, error: "تعذر حذف كل الحجوزات" };
  }

  revalidatePath("/admin");
  redirect("/admin");
}