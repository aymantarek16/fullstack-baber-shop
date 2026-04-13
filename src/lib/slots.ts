import { SHOP_DAY_START_HOUR, SHOP_DAY_END_HOUR, SLOT_MINUTES } from "./constants";

/** Returns "HH:MM" labels for the working day */
export function generateTimeSlotLabels(): string[] {
  const labels: string[] = [];
  let h = SHOP_DAY_START_HOUR;
  let m = 0;
  const end = SHOP_DAY_END_HOUR * 60 + 0;
  while (h * 60 + m < end) {
    labels.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += SLOT_MINUTES;
    if (m >= 60) {
      m = 0;
      h += 1;
    }
  }
  return labels;
}

/** Convert "HH:MM" to PostgreSQL TIME string */
export function slotToTimeString(slot: string): string {
  const [hh, mm] = slot.split(":").map(Number);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`;
}

/** Compare DB time string "HH:MM:SS" or "HH:MM" to slot */
export function timeStringToSlotLabel(dbTime: string): string {
  const parts = dbTime.split(":");
  return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
}
