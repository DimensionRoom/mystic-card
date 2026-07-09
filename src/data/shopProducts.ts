export type DeckKind = "Oracle" | "Tarot";

export interface Product {
  id: string;
  kind: DeckKind;
  title: string;
  countLabel: string;
  /** deck ฟรีใช้ได้เลยไม่ต้องซื้อ — ราคาแสดงเป็น "ฟรี" */
  access: "free" | "paid";
  price: number;
  image: string;
  badge?: "ขายดี" | "ใหม่";
  rating: number;
  /** in-app deck reading page, if this shop deck exists in the app */
  link?: string;
  /** guidebook e-book sold alongside the deck, if available */
  ebook?: {
    price: number;
    pages: string;
  };
}

/** deck id ที่ผูกกับสินค้า (ดึงจาก link "/deck/<id>") ใช้ตอนเพิ่มเข้ารายการที่มี */
export function productDeckId(product: Product): string {
  return product.link?.match(/^\/deck\/(.+)$/)?.[1] ?? product.id;
}

/** ค้นหาสินค้าจาก id — ใช้ในหน้าชำระเงินที่รับ id ผ่าน sessionStorage */
export function getProduct(id: string): Product | undefined {
  return shopProducts.find((p) => p.id === id);
}

export const shopProducts: Product[] = [
  {
    id: "cutie-cat-tarot-deck",
    kind: "Tarot",
    title: "Cutie Cat Tarot",
    countLabel: "78 ใบ",
    access: "free",
    price: 0,
    image: "/img/deck-cutie-cat.png",
    badge: "ขายดี",
    rating: 4.9,
    link: "/deck/cutie-cat",
    ebook: { price: 349, pages: "168 หน้า" },
  },
];

export interface BestSeller {
  rank: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  thumb: string;
}

export const bestSellers: BestSeller[] = [
  {
    rank: 1,
    title: "Cutie Cat Tarot",
    category: "Deck · Tarot",
    price: 0,
    rating: 4.9,
    thumb: "/img/deck-cutie-cat.png",
  },
  {
    rank: 2,
    title: "คู่มือ Cutie Cat Tarot",
    category: "E-book · คู่มือ",
    price: 349,
    rating: 4.9,
    thumb: "/img/cover-cutie-cat.png",
  },
];
