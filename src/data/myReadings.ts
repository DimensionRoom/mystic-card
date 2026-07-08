import { formatThaiDateTime, type ReadingCardRow } from "../lib/db";

export interface ReadingItem {
  id: string;
  /** deck id ที่อ่าน ใช้หา card back สำหรับ fallback รูปไพ่ใน modal ผลการอ่าน */
  deckId: string;
  deckName: string;
  deckType: "Oracle" | "Tarot";
  cover: string;
  title: string;
  date: string;
  time: string;
  cardCount: number;
  category?: string;
  preview: string;
  isFavorite: boolean;
  /** epoch ms — used for "ล่าสุด" sort and for the "อ่านเดือนนี้" stat */
  sortKey: number;
  /** ไพ่ที่จั่วได้ในครั้งนั้น ใช้เปิดดูผลการอ่านย้อนหลัง (แถวเก่าอาจไม่มี) */
  cards?: ReadingCardRow[];
}

/**
 * ชื่อประวัติการอ่าน = ชื่อไพ่ทุกใบต่อกันด้วยคอมมา
 * เช่น "Nine of Cups, Ten of Swords, II · The High Priestess"
 * ถ้าไม่มีรายละเอียดไพ่ (แถวเก่า) ใช้ title เดิมที่บันทึกไว้
 */
export function readingDisplayTitle(item: {
  title: string;
  cards?: ReadingCardRow[];
}): string {
  if (item.cards && item.cards.length > 0) {
    return item.cards.map((c) => c.title).join(", ");
  }
  return item.title;
}

/** สร้าง timestamp จริงย้อนไป N วันจากตอนนี้ ให้ mock data ดูสดใหม่เสมอไม่ว่าจะเปิดวันไหน */
function daysAgo(n: number): number {
  return Date.now() - n * 24 * 60 * 60 * 1000;
}

function mockEntry(
  daysBack: number,
  fields: Omit<ReadingItem, "date" | "time" | "sortKey">,
): ReadingItem {
  const sortKey = daysAgo(daysBack);
  const { date, time } = formatThaiDateTime(new Date(sortKey).toISOString());
  return { ...fields, date, time, sortKey };
}

export const myReadings: ReadingItem[] = [
  mockEntry(0, {
    id: "reading-001",
    deckId: "cutie-cat",
    deckName: "Cutie Cat Tarot",
    deckType: "Tarot",
    cover: "/img/deck-cutie-cat.png",
    title: "ตอนนี้ฉันควรโฟกัสกับอะไรเป็นพิเศษ?",
    cardCount: 3,
    preview:
      "ไพ่แนะนำให้เปิดรับความหวังใหม่ ก้าวอย่างกล้าหาญ และเชื่อมั่นในแสงสว่างของตัวเอง...",
    isFavorite: true,
    cards: [
      {
        id: "cutie-cat-1",
        title: "0 · The Fool",
        subtitle: "คนโง่ผู้กล้า",
        image: "/img/decks/cutie-cat/01.png",
        meaning:
          "แมวน้อยก้าวออกเดินทางด้วยหัวใจไร้กังวล คือการเริ่มต้นบทใหม่ด้วยความไร้เดียงสาและความกล้า",
      },
      {
        id: "cutie-cat-18",
        title: "XVII · The Star",
        subtitle: "ดวงดาว",
        image: "/img/decks/cutie-cat/18.png",
        meaning:
          "แมวน้อยมองดวงดาวระยิบระยับด้วยความหวัง เป็นตัวแทนของความหวังและการเยียวยา",
      },
      {
        id: "cutie-cat-20",
        title: "XIX · The Sun",
        subtitle: "พระอาทิตย์",
        image: "/img/decks/cutie-cat/20.png",
        meaning:
          "แมวน้อยเริงร่าใต้แสงอาทิตย์อบอุ่น เป็นตัวแทนของความสุข ความสำเร็จ และพลังบวก",
      },
    ],
  }),
  mockEntry(3, {
    id: "reading-002",
    deckId: "cutie-cat",
    deckName: "Cutie Cat Tarot",
    deckType: "Tarot",
    cover: "/img/deck-cutie-cat.png",
    title: "สิ่งที่ควรรู้เกี่ยวกับเส้นทางข้างหน้า",
    cardCount: 1,
    preview:
      "แสงดาวส่องนำทาง ความหวังและการเยียวยากำลังมาถึง จงเชื่อในความฝันและมองไปข้างหน้าด้วยใจสงบ...",
    isFavorite: false,
    // จงใจไม่ใส่ image เลียนแบบแถวเก่าใน DB — modal ต้องหารูปจากชื่อไพ่เอง
    cards: [
      {
        id: "cutie-cat-18",
        title: "XVII · The Star",
        subtitle: "ดวงดาว",
        meaning:
          "แมวน้อยมองดวงดาวระยิบระยับด้วยความหวัง เป็นตัวแทนของความหวัง การเยียวยา และแรงบันดาลใจหลังผ่านค่ำคืนที่ยากลำบาก",
      },
    ],
  }),
  mockEntry(45, {
    id: "reading-004",
    deckId: "cutie-cat",
    deckName: "Cutie Cat Tarot",
    deckType: "Tarot",
    cover: "/img/deck-cutie-cat.png",
    title: "ข้อความจากจักรวาลสำหรับฉันในวันนี้",
    cardCount: 1,
    preview: "จงเชื่อมั่นในตัวเองและแสงสว่างในหัวใจของคุณ คุณมีพลังมากกว่าที่คุณคิด...",
    isFavorite: false,
    cards: [
      {
        id: "cutie-cat-9",
        title: "VIII · Strength",
        subtitle: "พลัง",
        image: "/img/decks/cutie-cat/09.png",
        meaning:
          "พลังที่แท้จริงมาจากความสงบและความเมตตา จงเผชิญความท้าทายด้วยหัวใจที่มั่นคงและอ่อนโยน",
      },
    ],
  }),
];

export interface ReadingNote {
  id: string;
  quote: string;
  date: string;
  deckName: string;
  thumb: string;
}

export const readingNotes: ReadingNote[] = [
  {
    id: "note-1",
    quote:
      "“การปล่อยวาง ไม่ได้แปลว่าการยอมแพ้ แต่คือการไว้ใจว่า จักรวาลจะพาเราไปในที่ที่ดีขึ้นเสมอ” ✨",
    date: formatThaiDateTime(new Date(daysAgo(0)).toISOString()).date,
    deckName: "Cutie Cat Tarot",
    thumb: "/img/deck-cutie-cat.png",
  },
];
