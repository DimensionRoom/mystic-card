export type DeckKind = "Oracle" | "Tarot";

export interface Product {
  id: string;
  kind: DeckKind;
  title: string;
  countLabel: string;
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

export const shopProducts: Product[] = [
  {
    id: "moonlight-oracle-deck",
    kind: "Oracle",
    title: "Moonlight Oracle",
    countLabel: "44 ใบ",
    price: 590,
    image: "/img/deck-moon.png",
    badge: "ขายดี",
    rating: 4.9,
    link: "/deck/moonlight",
    ebook: { price: 290, pages: "72 หน้า" },
  },
  {
    id: "cutie-cat-tarot-deck",
    kind: "Tarot",
    title: "Cutie Cat Tarot",
    countLabel: "78 ใบ",
    price: 690,
    image: "/img/deck-cutie-cat.png",
    badge: "ใหม่",
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
    title: "Moonlight Oracle",
    category: "Deck · Oracle",
    price: 590,
    rating: 4.9,
    thumb: "/img/deck-moon.png",
  },
  {
    rank: 2,
    title: "Cutie Cat Tarot",
    category: "Deck · Tarot",
    price: 690,
    rating: 4.9,
    thumb: "/img/deck-cutie-cat.png",
  },
  {
    rank: 3,
    title: "คู่มือ Moonlight Oracle",
    category: "E-book · คู่มือ",
    price: 290,
    rating: 4.9,
    thumb: "/img/ebook-moonlight.png",
  },
];
