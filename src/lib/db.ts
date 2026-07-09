import { supabase } from "./supabase";
import type { OracleCard } from "../data/readingCards";

/* ---------- Deck ที่ซื้อ + รายการโปรด ---------- */

export async function fetchOwnedDeckIds(userId: string): Promise<string[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("owned_decks")
    .select("deck_id")
    .eq("user_id", userId);
  return (data ?? []).map((r) => r.deck_id as string);
}

/** เพิ่ม deck เข้ารายการที่ผู้ใช้มี (หลังรับฟรี/ชำระเงินสำเร็จ) */
export async function addOwnedDeck(
  userId: string,
  deckId: string,
): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("owned_decks")
    .upsert({ user_id: userId, deck_id: deckId });
}

export async function fetchFavoriteDeckIds(userId: string): Promise<string[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("deck_favorites")
    .select("deck_id")
    .eq("user_id", userId);
  return (data ?? []).map((r) => r.deck_id as string);
}

export async function setDeckFavorite(
  userId: string,
  deckId: string,
  favorite: boolean,
): Promise<void> {
  if (!supabase) return;
  if (favorite) {
    await supabase
      .from("deck_favorites")
      .upsert({ user_id: userId, deck_id: deckId });
  } else {
    await supabase
      .from("deck_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("deck_id", deckId);
  }
}

/* ---------- ประวัติการอ่าน ---------- */

/** ไพ่ที่จั่วได้ในการอ่านครั้งนั้น เก็บใน column cards (jsonb) —
    แถวเก่าอาจมีแค่ id/title จึงให้ฟิลด์อื่นเป็น optional */
export interface ReadingCardRow {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  meaning?: string;
}

export interface ReadingRow {
  id: string;
  deck_id: string;
  deck_name: string;
  deck_type: string;
  reading_type: string;
  title: string;
  preview: string;
  card_count: number;
  cards: ReadingCardRow[];
  is_favorite: boolean;
  created_at: string;
}

export async function fetchReadings(userId: string): Promise<ReadingRow[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("readings")
    .select(
      "id, deck_id, deck_name, deck_type, reading_type, title, preview, card_count, cards, is_favorite, created_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as ReadingRow[];
}

export async function saveReading(
  userId: string,
  input: {
    deckId: string;
    deckName: string;
    deckType: string;
    readingType: string;
    cards: OracleCard[];
  },
): Promise<void> {
  if (!supabase) return;
  const first = input.cards[0];
  // ชื่อประวัติ = ชื่อไพ่ทุกใบต่อกันด้วยคอมมา
  const title =
    input.cards.length > 0
      ? input.cards.map((c) => c.title).join(", ")
      : "การอ่านไพ่";
  await supabase.from("readings").insert({
    user_id: userId,
    deck_id: input.deckId,
    deck_name: input.deckName,
    deck_type: input.deckType,
    reading_type: input.readingType,
    title,
    preview: first ? first.meaning : "",
    card_count: input.cards.length,
    // เก็บรายละเอียดไพ่ครบ เพื่อให้หน้า "การอ่านของฉัน" เปิดดูผลย้อนหลังได้
    cards: input.cards.map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: c.subtitle,
      image: c.image,
      meaning: c.meaning,
    })),
  });
}

export async function setReadingFavorite(
  readingId: string,
  favorite: boolean,
): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("readings")
    .update({ is_favorite: favorite })
    .eq("id", readingId);
}

export async function deleteReading(readingId: string): Promise<void> {
  if (!supabase) return;
  await supabase.from("readings").delete().eq("id", readingId);
}

/** ลบประวัติการอ่านทั้งหมดของผู้ใช้ (โน้ตไม่ถูกลบด้วย) */
export async function deleteAllReadings(userId: string): Promise<void> {
  if (!supabase) return;
  await supabase.from("readings").delete().eq("user_id", userId);
}

/* ---------- โน้ต ---------- */

export interface NoteRow {
  id: string;
  reading_id: string | null;
  deck_name: string;
  content: string;
  created_at: string;
}

export async function fetchNotes(userId: string): Promise<NoteRow[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("reading_notes")
    .select("id, reading_id, deck_name, content, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  return (data ?? []) as NoteRow[];
}

export async function saveNote(
  userId: string,
  input: { readingId?: string; deckName: string; content: string },
): Promise<void> {
  if (!supabase) return;
  await supabase.from("reading_notes").insert({
    user_id: userId,
    reading_id: input.readingId ?? null,
    deck_name: input.deckName,
    content: input.content,
  });
}

/* ---------- E-book ---------- */

export async function purchaseEbook(
  userId: string,
  deckId: string,
  price: number,
): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("ebook_purchases")
    .upsert({ user_id: userId, deck_id: deckId, price });
}

/** แปลง timestamp จาก DB เป็นข้อความไทยสั้น ๆ เช่น "10 พ.ค. 2569 • 21:45" */
export function formatThaiDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}
