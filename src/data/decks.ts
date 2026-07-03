export type DeckType = "Tarot" | "Oracle";

export interface Deck {
  id: string;
  name: string;
  type: DeckType;
  cardCount: number;
  /** card cover art cropped from the reference design */
  image: string;
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
    id: "dreamy-unicorn",
    name: "Dreamy Unicorn",
    type: "Tarot",
    cardCount: 78,
    image: "/img/deck-unicorn.png",
    tagline: "ไพ่ทาโรต์สายฝัน พาหัวใจโบยบินบนสายรุ้ง",
    level: "เหมาะสำหรับผู้เริ่มต้น",
    cardBack: "/img/deck-unicorn.png",
    about:
      "Dreamy Unicorn Tarot คือไพ่ทาโรต์ 78 ใบในโทนพาสเทลหวานละมุน ภาพประกอบยูนิคอร์นน้อยบนก้อนเมฆจะช่วยให้การอ่านไพ่เป็นเรื่องอ่อนโยนและเป็นมิตร เหมาะกับคำถามเรื่องความฝันและกำลังใจ",
  },
  {
    id: "pastel-fairy",
    name: "Pastel Fairy",
    type: "Oracle",
    cardCount: 44,
    image: "/img/deck-fairy.png",
    tagline: "เสียงกระซิบจากภูตน้อย ปลอบใจอย่างอ่อนโยน",
    level: "เหมาะสำหรับผู้เริ่มต้น",
    cardBack: "/img/deck-fairy.png",
    about:
      "Pastel Fairy Oracle คือไพ่ออราเคิล 44 ใบจากดินแดนภูตดอกไม้ ทุกใบมีข้อความปลอบประโลมใจ เหมาะกับการเปิดไพ่รายวันเพื่อเติมพลังบวก",
  },
  {
    id: "magic-cat",
    name: "Magic Cat",
    type: "Tarot",
    cardCount: 78,
    image: "/img/deck-cat.png",
    tagline: "แมวดำผู้รู้ความลับของดวงดาว",
    level: "เหมาะสำหรับผู้มีประสบการณ์",
    cardBack: "/img/deck-cat.png",
    about:
      "Magic Cat Tarot คือไพ่ทาโรต์ 78 ใบในธีมแมวดำและเวทมนตร์ยามค่ำคืน ให้คำตอบที่ตรงไปตรงมาพร้อมความขี้เล่นแบบแมว ๆ เหมาะกับคำถามที่ต้องการมุมมองลึกซึ้ง",
  },
  {
    id: "moonlight",
    name: "Moonlight Oracle",
    type: "Oracle",
    cardCount: 44,
    image: "/img/deck-moon.png",
    tagline: "ไพ่ปลอบใจจากแสงจันทร์ นำทางหัวใจในทุกช่วงเวลา",
    level: "เหมาะสำหรับผู้เริ่มต้น",
    cardBack: "/img/card-back.png",
    about:
      "Moonlight Oracle คือไพ่ออราเคิล 44 ใบใต้แสงจันทร์สีพาสเทล ทุกใบส่งข้อความอ่อนโยนเหมือนแสงจันทร์ยามค่ำคืน เหมาะกับการถามหาคำปลอบใจ กำลังใจ และทิศทางของหัวใจ",
  },
  {
    id: "little-love",
    name: "Little Love",
    type: "Oracle",
    cardCount: 44,
    image: "/img/deck-love.png",
    tagline: "ไพ่ความรักฟูฟ่อง อบอุ่นเหมือนกอดหมาน้อย",
    level: "เหมาะสำหรับผู้เริ่มต้น",
    cardBack: "/img/deck-love.png",
    about:
      "Little Love Oracle คือไพ่ออราเคิล 44 ใบธีมความรักและความอบอุ่น ภาพหมาน้อยและหัวใจฟู ๆ จะช่วยตอบคำถามเรื่องความรักและความสัมพันธ์อย่างนุ่มนวล",
  },
  {
    id: "mystic-time",
    name: "Mystic Time",
    type: "Tarot",
    cardCount: 78,
    image: "/img/deck-time.png",
    tagline: "ไพ่แห่งกาลเวลา บอกจังหวะที่ใช่ของชีวิต",
    level: "เหมาะสำหรับผู้มีประสบการณ์",
    cardBack: "/img/deck-time.png",
    about:
      "Mystic Time Tarot คือไพ่ทาโรต์ 78 ใบธีมกาลเวลาและกระจกสี เหมาะกับคำถามเรื่องจังหวะชีวิต การรอคอย และการตัดสินใจครั้งสำคัญ",
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
  {
    id: "r2",
    title: "เรื่องราวความรัก",
    deckName: "Dreamy Unicorn Tarot",
    image: "/img/deck-unicorn.png",
    cardCount: 5,
    when: "เมื่อวาน",
  },
  {
    id: "r3",
    title: "สิ่งที่ควรรู้ตอนนี้",
    deckName: "Magic Cat Tarot",
    image: "/img/deck-cat.png",
    cardCount: 1,
    when: "3 วันที่แล้ว",
  },
];
