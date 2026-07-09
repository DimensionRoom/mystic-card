/**
 * เก็บ deck ที่ผู้ใช้ "มี" (ซื้อ/รับฟรีแล้ว) ในโหมด demo/ยังไม่ล็อกอิน ผ่าน
 * localStorage — เริ่มต้นว่างเสมอ ต้องไปกดรับ/ซื้อจากหน้าร้านค้าก่อนถึงจะมี
 * (โหมดล็อกอินจริงใช้ตาราง owned_decks ใน Supabase ผ่าน lib/db.ts แทน)
 */
const KEY = "mystic-card-owned-decks";

export function getLocalOwnedDeckIds(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addLocalOwnedDeck(deckId: string): void {
  const ids = new Set(getLocalOwnedDeckIds());
  ids.add(deckId);
  localStorage.setItem(KEY, JSON.stringify([...ids]));
}
