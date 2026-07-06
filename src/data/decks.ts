export type DeckType = "Tarot" | "Oracle";

export interface Deck {
  id: string;
  name: string;
  type: DeckType;
  cardCount: number;
  /** ปกด้านนอก (thumbnail) ที่โชว์ในชั้นวาง/ร้านค้า/รายการ Deck */
  image: string;
  /** ปกใบเต็มด้านในหน้า "เกี่ยวกับ Deck" — ถ้าไม่ระบุจะใช้ cardBack แทน */
  cover?: string;
  /** short poetic subtitle shown on the deck reading page */
  tagline: string;
  /** who this deck suits, shown as a badge */
  level: string;
  /** card back art used in the reading area */
  cardBack: string;
  about: string;
}

export const decks: Deck[] = [
  {
    id: "moonlight",
    name: "Moonlight Oracle",
    type: "Oracle",
    cardCount: 44,
    image: "/img/deck-moon.png",
    cover: "/img/deck-cover.png",
    tagline: "ไพ่ปลอบใจจากแสงจันทร์ นำทางหัวใจในทุกช่วงเวลา",
    level: "เหมาะสำหรับผู้เริ่มต้น",
    cardBack: "/img/card-back.png",
    about:
      "Moonlight Oracle คือไพ่ออราเคิล 44 ใบใต้แสงจันทร์สีพาสเทล ทุกใบส่งข้อความอ่อนโยนเหมือนแสงจันทร์ยามค่ำคืน เหมาะกับการถามหาคำปลอบใจ กำลังใจ และทิศทางของหัวใจ",
  },
  {
    id: "cutie-cat",
    name: "Cutie Cat Tarot",
    type: "Tarot",
    cardCount: 78,
    image: "/img/deck-cutie-cat.png",
    cover: "/img/cover-cutie-cat.png",
    tagline: "ไพ่ทาโรต์แมวน้อยแสนน่ารัก อ่านหัวใจได้ครบทุกมิติของชีวิต",
    level: "เหมาะสำหรับทุกระดับ",
    cardBack: "/img/card-back-cutie-cat.png",
    about:
      "Cutie Cat Tarot คือไพ่ทาโรต์มาตรฐาน 78 ใบในธีมแมวน้อยแสนน่ารักโทนพาสเทล ครบทั้ง Major Arcana 22 ใบ และ Minor Arcana 56 ใบใน 4 ชุด เหมาะสำหรับทั้งผู้เริ่มต้นและผู้มีประสบการณ์ ให้คำตอบที่ครอบคลุมทุกด้านของชีวิตอย่างอ่อนโยน",
  },
];

export function getDeck(id: string): Deck | undefined {
  return decks.find((deck) => deck.id === id);
}

export interface Reading {
  id: string;
  title: string;
  deckName: string;
  image: string;
  cardCount: number;
  when: string;
}

export const recentReadings: Reading[] = [
  {
    id: "r1",
    title: "คำแนะนำจากจักรวาล",
    deckName: "Moonlight Oracle",
    image: "/img/deck-moon.png",
    cardCount: 3,
    when: "2 ชั่วโมงที่แล้ว",
  },
];
