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

// ตัวอย่างไพ่ Cutie Cat ดึงจากสำรับจริง
const cutieCatPreviews = [1, 20, 18, 37, 22].map((id) => {
  const c = cutieCatCards.find((card) => card.id === id)!;
  return { name: c.thaiTitle, image: c.image };
});

export function getAboutInfo(deck: Deck): DeckAboutInfo {
  return {
    description: deck.about,
    // ปกใบเต็มด้านใน ใช้ deck.cover ก่อน ถ้าไม่ระบุค่อย fallback เป็นหลังไพ่
    cover: deck.cover ?? deck.cardBack,
    features,
    details: [
      ["ประเภท", deck.type],
      ["จำนวนไพ่", `${deck.cardCount} ใบ`],
      ["ขนาดไพ่", "70 x 120 mm"],
      ["สไตล์", "Pastel Fantasy"],
      ["เหมาะสำหรับ", "ทั้งผู้เริ่มต้นและผู้มีประสบการณ์"],
      ["พลังงานหลัก", "ความน่ารัก, ปัญญา, ครอบคลุมทุกด้านของชีวิต"],
      ["เผยแพร่ครั้งแรก", "2024"],
    ],
    previews: cutieCatPreviews,
    ebook: {
      title: `${deck.name} Guidebook`,
      subtitle: "คู่มือทาโรต์แมวน้อยฉบับสมบูรณ์",
      cover: "/img/ebook-cover.png",
      bullets: [
        `ความหมายไพ่ทั้ง ${deck.cardCount} ใบ`,
        "เทคนิคการอ่านไพ่",
        "ตัวอย่างการอ่านจริง",
        "ความหมายไพ่กลับหัวครบทุกใบ",
      ],
      format: "PDF",
      pages: "168 หน้า",
      language: "ไทย",
      price: 349,
    },
  };
}
