// Business + payment details. Update these with your real values.
export const STORE = {
  // Business WhatsApp — receives payment screenshots and sends order confirmations.
  whatsapp: "923190189227",
  whatsappDisplay: "0319 0189227",
  // TODO: replace with your real Easypaisa number + account holder name.
  easypaisaNumber: "0319 0189227",
  easypaisaName: "Al-Madina",
};

/** Normalize a Pakistani phone number to wa.me international format (digits only, no +). */
export function waNumber(phone: string): string {
  let d = phone.replace(/[^\d]/g, "");
  if (d.startsWith("0")) d = "92" + d.slice(1);
  return d;
}

/** Build a wa.me deep link with a pre-filled message. */
export function waLink(phone: string, text: string): string {
  return `https://wa.me/${waNumber(phone)}?text=${encodeURIComponent(text)}`;
}
