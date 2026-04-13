/** Egyptian mobile: 01xxxxxxxxx, +201xxxxxxxxx, or 201xxxxxxxxx */
export function isValidEgyptianPhone(input: string): boolean {
  const digits = input.replace(/\s+/g, "").replace(/-/g, "");
  const normalized = digits.startsWith("+") ? digits.slice(1) : digits;
  if (/^01[0125][0-9]{8}$/.test(normalized)) return true;
  if (/^201[0125][0-9]{8}$/.test(normalized)) return true;
  return false;
}

export function normalizePhoneForStorage(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("20") && digits.length === 12) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 11) return `+20${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("1")) return `+20${digits}`;
  return input.trim();
}
