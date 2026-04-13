export function buildBookingWhatsAppText(params: {
  name: string;
  phone: string;
  serviceName: string;
  barberName: string;
  dateLabel: string;
  timeLabel: string;
  notes: string;
}): string {
  return [
    `الاسم: ${params.name}`,
    `الموبايل: ${params.phone}`,
    `الخدمة: ${params.serviceName}`,
    `الحلاق: ${params.barberName}`,
    `التاريخ: ${params.dateLabel}`,
    `الوقت: ${params.timeLabel}`,
    `ملاحظات: ${params.notes || "—"}`,
  ].join("\n");
}

export function whatsAppLink(phoneDigits: string, text: string): string {
  const clean = phoneDigits.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}
