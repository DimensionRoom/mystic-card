import { formatThaiDateTime, type ReadingCardRow } from "../lib/db";

export interface ReadingItem {
  id: string;
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
    deckName: "Moonlight Oracle",
    deckType: "Oracle",
    cover: "/img/deck-cover.png",
    title: "ตอนนี้ฉันควรโฟกัสกับอะไรเป็นพิเศษ?",
    cardCount: 3,
    preview:
      "ไพ่แนะนำให้คุณหันมาใส่ใจความสงบภายใน ปล่อยวางสิ่งที่ควบคุมไม่ได้ และเชื่อมั่นในจังหวะของชีวิต...",
    isFavorite: true,
    cards: [
      {
        id: "mock-2",
        title: "2. Inner Peace",
        subtitle: "ความสงบภายใน",
        image: "/img/deck-moon.png",
        meaning: "ช่วงเวลานี้เหมาะกับการฟังเสียงภายในและปล่อยให้ใจได้พัก",
      },
      {
        id: "mock-3",
        title: "3. Letting Go",
        subtitle: "การปล่อยวาง",
        image: "/img/deck-fairy.png",
        meaning: "การปล่อยวางไม่ใช่การยอมแพ้ แต่คือการเปิดพื้นที่ให้สิ่งใหม่ที่ดีกว่าเข้ามา",
      },
      {
        id: "mock-5",
        title: "5. Trust the Journey",
        subtitle: "เชื่อมั่นในเส้นทาง",
        image: "/img/deck-cat.png",
        meaning: "ทุกก้าวที่คุณเดินล้วนมีความหมาย เชื่อมั่นว่าเส้นทางนี้กำลังพาคุณไปยังที่ที่ใช่",
      },
    ],
  }),
  mockEntry(45, {
    id: "reading-004",
    deckName: "Moonlight Oracle",
    deckType: "Oracle",
    cover: "/img/deck-cover.png",
    title: "ข้อความจากจักรวาลสำหรับฉันในวันนี้",
    cardCount: 1,
    preview: "จงเชื่อมั่นในตัวเองและแสงสว่างในหัวใจของคุณ คุณมีพลังมากกว่าที่คุณคิด...",
    isFavorite: false,
    cards: [
      {
        id: "mock-7",
        title: "7. Self Love",
        subtitle: "รักตัวเอง",
        image: "/img/deck-love.png",
        meaning: "คุณมีค่ามากพอโดยไม่ต้องพิสูจน์อะไรกับใคร ความรักที่มั่นคงที่สุดเริ่มต้นจากข้างใน",
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
    deckName: "Moonlight Oracle",
    thumb: "/img/deck-moon.png",
  },
];
