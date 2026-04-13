"use server";

import { createClient } from "@/lib/supabase/server";
import { isValidEgyptianPhone, normalizePhoneForStorage } from "@/lib/validation";
import { slotToTimeString, timeStringToSlotLabel } from "@/lib/slots";
import { buildBookingWhatsAppText, whatsAppLink } from "@/lib/whatsapp";

export type BookedSlotsResult =
  | { ok: true; taken: string[] }
  | { ok: false; error: string };

export async function getBookedSlots(barberId: string, dateIso: string): Promise<BookedSlotsResult> {
  if (!barberId || !dateIso) {
    return { ok: false, error: "بيانات ناقصة" };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_booked_slots", {
    p_barber_id: barberId,
    p_date: dateIso,
  });
  if (error) {
    return { ok: false, error: "تعذر جلب المواعيد المحجوزة" };
  }
  const rows = (data ?? []) as unknown[];
  const taken = rows
    .map((row) => {
      if (row == null) return null;
      if (typeof row === "string") return timeStringToSlotLabel(row);
      if (typeof row === "object" && "slot_time" in row) {
        const v = (row as { slot_time: string }).slot_time;
        return v ? timeStringToSlotLabel(String(v)) : null;
      }
      return null;
    })
    .filter((x): x is string => Boolean(x));
  return { ok: true, taken };
}

export type CreateBookingResult =
  | {
      ok: true;
      whatsappUrl: string;
    }
  | { ok: false; error: string };

export async function createBooking(input: {
  customerName: string;
  phone: string;
  serviceId: string;
  barberId: string;
  bookingDate: string;
  timeSlot: string;
  notes: string;
  serviceName: string;
  barberName: string;
}): Promise<CreateBookingResult> {
  const name = input.customerName?.trim();
  const phoneRaw = input.phone?.trim();
  const notes = input.notes?.trim() ?? "";

  if (!name || name.length < 2) {
    return { ok: false, error: "الرجاء إدخال الاسم" };
  }
  if (!phoneRaw || !isValidEgyptianPhone(phoneRaw)) {
    return { ok: false, error: "رقم موبايل مصري غير صالح" };
  }
  if (!input.serviceId || !input.barberId || !input.bookingDate || !input.timeSlot) {
    return { ok: false, error: "الرجاء تعبئة كل الحقول المطلوبة" };
  }

  const phone = normalizePhoneForStorage(phoneRaw);
  const booking_time = slotToTimeString(input.timeSlot);

  const supabase = await createClient();
  const { error } = await supabase.from("bookings").insert({
    customer_name: name,
    phone,
    barber_id: input.barberId,
    service_id: input.serviceId,
    booking_date: input.bookingDate,
    booking_time,
    notes: notes || null,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "الموعد ده متاحش — اختار وقت تاني" };
    }
    return { ok: false, error: "حصل خطأ أثناء الحجز. حاول تاني" };
  }

  const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_PHONE ?? "";
  if (!waPhone.replace(/\D/g, "")) {
    return { ok: false, error: "إعدادات واتساب ناقصة على السيرفر" };
  }

  const dateLabel = input.bookingDate;
  const text = buildBookingWhatsAppText({
    name,
    phone,
    serviceName: input.serviceName,
    barberName: input.barberName,
    dateLabel,
    timeLabel: input.timeSlot,
    notes,
  });
  const whatsappUrl = whatsAppLink(waPhone, text);

  return { ok: true, whatsappUrl };
}
