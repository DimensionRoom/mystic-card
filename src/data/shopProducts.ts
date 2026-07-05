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
    title: "คู่มือ Moonlight Oracle",
    category: "E-book · คู่มือ",
    price: 290,
    rating: 4.9,
    thumb: "/img/ebook-moonlight.png",
  },
];
