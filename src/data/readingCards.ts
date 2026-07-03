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
