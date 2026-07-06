import { cutieCatCards } from "./cutieCatCards";

export interface OracleCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  meaning: string;
}

/** mock cards drawn during a reading, in reveal order */
export const sampleCards: OracleCard[] = [
  {
    id: "universe-message",
    title: "คำแนะนำจากจักรวาล",
    subtitle: "เมื่อสักครู่",
    image: "/img/card-rabbit.png",
    meaning: "แสงจันทร์กำลังนำทางคุณไปสู่คำตอบที่หัวใจรอคอย",
  },
  {
    id: "inner-peace",
    title: "Inner Peace",
    subtitle: "ความสงบภายใน",
    image: "/img/deck-moon.png",
    meaning: "ช่วงเวลานี้เหมาะกับการฟังเสียงภายในและปล่อยให้ใจได้พัก",
  },
  {
    id: "trust-the-journey",
    title: "Trust the Journey",
    subtitle: "เชื่อมั่นในเส้นทาง",
    image: "/img/deck-love.png",
    meaning: "ทุกก้าวที่คุณเดินกำลังพาคุณไปยังจังหวะที่เหมาะสม",
  },
  {
    id: "new-dawn",
    title: "New Dawn",
    subtitle: "แสงแรกของวันใหม่",
    image: "/img/deck-fairy.png",
    meaning: "การเริ่มต้นใหม่กำลังผลิบาน อ่อนโยนกับตัวเองในช่วงเปลี่ยนผ่าน",
  },
  {
    id: "little-steps",
    title: "Little Steps",
    subtitle: "ก้าวเล็ก ๆ ที่กล้าหาญ",
    image: "/img/deck-unicorn.png",
    meaning: "ความสำเร็จของคุณเกิดจากก้าวเล็ก ๆ ที่ทำด้วยหัวใจทุกวัน",
  },
];

/** ไพ่ตัวอย่างที่จั่วได้ตอนเปิดไพ่ Cutie Cat Tarot (ภาพเป็น placeholder จนกว่าจะมีภาพจริง) */
const cutieCatDraw: OracleCard[] = [1, 20, 37, 18, 74].map((id) => {
  const c = cutieCatCards.find((card) => card.id === id)!;
  return {
    id: `cutie-${c.id}`,
    title: c.title,
    subtitle: c.thaiTitle,
    image: c.image,
    meaning: c.meaning,
  };
});

/** เลือกชุดไพ่ที่จั่วได้ตาม deck id — Moonlight ใช้ sampleCards เดิม */
export function getSampleCards(deckId: string): OracleCard[] {
  return deckId === "cutie-cat" ? cutieCatDraw : sampleCards;
}
