import type { Deck } from "./decks";
import type { IconName } from "../components/Icon";
import { cutieCatCards } from "./cutieCatCards";

export interface DeckAboutInfo {
  description: string;
  cover: string;
  features: {
    icon: IconName;
    iconClass: string;
    title: string;
    text: string;
  }[];
  details: [string, string][];
  previews: { name: string; image: string }[];
  ebook: {
    title: string;
    subtitle: string;
    cover: string;
    bullets: string[];
    format: string;
    pages: string;
    language: string;
    price: number;
  };
}

const features: DeckAboutInfo["features"] = [
  {
    icon: "moon",
    iconClass: "bg-sky-50 text-sky-500",
    title: "ปลอบโยนใจ",
    text: "ให้พลังงานที่อ่อนโยน และปลอบประโลมจิตใจ",
  },
  {
    icon: "sparkles",
    iconClass: "bg-amber-50 text-amber-500",
    title: "นำทางชีวิต",
    text: "ช่วยให้เห็นทางเลือก และแนวทางที่ชัดเจนขึ้น",
  },
  {
    icon: "heart",
    iconClass: "bg-pink-50 text-mystic-pink",
    title: "เชื่อมโยงสัญชาตญาณ",
    text: "เสริมสร้างการเชื่อมต่อ กับตัวตนภายใน",
  },
  {
    icon: "cloud",
    iconClass: "bg-indigo-50 text-indigo-400",
    title: "เหมาะสำหรับทุกคน",
    text: "ไม่จำเป็นต้องมีพื้นฐาน ก็สามารถอ่านได้",
  },
];

const moonlightPreviews = [
  { name: "New Beginnings", image: "/img/preview-1.png" },
  { name: "Inner Peace", image: "/img/preview-2.png" },
  { name: "Healing Heart", image: "/img/preview-3.png" },
  { name: "Full Moon", image: "/img/preview-4.png" },
  { name: "Trust the Journey", image: "/img/preview-5.png" },
];

// ตัวอย่างไพ่ Cutie Cat ดึงจากสำรับจริง (ภาพเป็น placeholder จนกว่าจะมีภาพจริง)
const cutieCatPreviews = [1, 20, 18, 37, 22].map((id) => {
  const c = cutieCatCards.find((card) => card.id === id)!;
  return { name: c.thaiTitle, image: c.image };
});

export function getAboutInfo(deck: Deck): DeckAboutInfo {
  const isMoonlight = deck.id === "moonlight";
  const isCutieCat = deck.id === "cutie-cat";
  return {
    description: isMoonlight
      ? "Moonlight Oracle คือไพ่ที่เกิดขึ้นเพื่อเป็นเพื่อนในใจยามที่คุณต้องการคำปลอบโยน แสงจันทร์เป็นสัญลักษณ์ของความอ่อนโยน ความหวัง และการเริ่มต้นใหม่ ไพ่ชุดนี้จะช่วยให้คุณเชื่อมโยงกับสัญชาตญาณภายในตัวเอง และพบคำตอบที่คุณมองหาอยู่เสมอ ✨"
      : deck.about,
    // ปกใบเต็มด้านใน ใช้ deck.cover ก่อน ถ้าไม่ระบุค่อย fallback เป็นหลังไพ่
    cover: deck.cover ?? deck.cardBack,
    features,
    details: [
      ["ประเภท", deck.type],
      ["จำนวนไพ่", `${deck.cardCount} ใบ`],
      ["ขนาดไพ่", "70 x 120 mm"],
      ["สไตล์", "Pastel Fantasy"],
      [
        "เหมาะสำหรับ",
        isCutieCat
          ? "ทั้งผู้เริ่มต้นและผู้มีประสบการณ์"
          : "ผู้เริ่มต้น และผู้ที่ต้องการคำปลอบโยนในชีวิต",
      ],
      [
        "พลังงานหลัก",
        isCutieCat
          ? "ความน่ารัก, ปัญญา, ครอบคลุมทุกด้านของชีวิต"
          : "ความอ่อนโยน, ความหวัง, การเริ่มต้นใหม่",
      ],
      ["เผยแพร่ครั้งแรก", "2024"],
    ],
    previews: isCutieCat ? cutieCatPreviews : moonlightPreviews,
    ebook: {
      title: `${deck.name} Guidebook`,
      subtitle: isCutieCat
        ? "คู่มือทาโรต์แมวน้อยฉบับสมบูรณ์"
        : "คู่มือนำทางด้วยแสงจันทร์",
      cover: "/img/ebook-cover.png",
      bullets: [
        `ความหมายไพ่ทั้ง ${deck.cardCount} ใบ`,
        "เทคนิคการอ่านไพ่",
        "ตัวอย่างการอ่านจริง",
        isCutieCat
          ? "ความหมายไพ่กลับหัวครบทุกใบ"
          : "แบบฝึกหัดเชื่อมโยงสัญชาตญาณ",
      ],
      format: "PDF",
      pages: isCutieCat ? "168 หน้า" : "128 หน้า",
      language: "ไทย",
      price: isCutieCat ? 349 : 299,
    },
  };
}
