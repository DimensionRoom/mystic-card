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
    id: "dreamy-unicorn-tarot-deck",
    kind: "Tarot",
    title: "Dreamy Unicorn Tarot",
    countLabel: "78 ใบ",
    price: 690,
    image: "/img/deck-unicorn.png",
    badge: "ใหม่",
    rating: 4.8,
    link: "/deck/dreamy-unicorn",
    ebook: { price: 320, pages: "96 หน้า" },
  },
  {
    id: "magic-cat-tarot-deck",
    kind: "Tarot",
    title: "Magic Cat Tarot",
    countLabel: "78 ใบ",
    price: 690,
    image: "/img/deck-cat.png",
    badge: "ขายดี",
    rating: 4.9,
    link: "/deck/magic-cat",
    ebook: { price: 320, pages: "96 หน้า" },
  },
  {
    id: "pastel-fairy-oracle-deck",
    kind: "Oracle",
    title: "Pastel Fairy Oracle",
    countLabel: "44 ใบ",
    price: 590,
    image: "/img/deck-fairy.png",
    rating: 4.8,
    link: "/deck/pastel-fairy",
    ebook: { price: 290, pages: "72 หน้า" },
  },
  {
    id: "little-love-oracle-deck",
    kind: "Oracle",
    title: "Little Love Oracle",
    countLabel: "44 ใบ",
    price: 520,
    image: "/img/deck-love.png",
    rating: 4.7,
    link: "/deck/little-love",
    ebook: { price: 250, pages: "64 หน้า" },
  },
  {
    id: "mystic-time-tarot-deck",
    kind: "Tarot",
    title: "Mystic Time Tarot",
    countLabel: "78 ใบ",
    price: 690,
    image: "/img/deck-time.png",
    rating: 4.8,
    link: "/deck/mystic-time",
    ebook: { price: 320, pages: "96 หน้า" },
  },
  {
    id: "starlight-oracle-deck",
    kind: "Oracle",
    title: "Starlight Oracle",
    countLabel: "54 ใบ",
    price: 620,
    image: "/img/deck-starlight.png",
    rating: 4.8,
  },
  {
    id: "crystal-wisdom-oracle-deck",
    kind: "Oracle",
    title: "Crystal Wisdom Oracle",
    countLabel: "45 ใบ",
    price: 580,
    image: "/img/deck-crystal.png",
    rating: 4.8,
  },
  {
    id: "lovely-animal-tarot-deck",
    kind: "Tarot",
    title: "Lovely Animal Tarot",
    countLabel: "78 ใบ",
    price: 690,
    image: "/img/deck-animal.png",
    rating: 4.9,
  },
  {
    id: "cosmic-journey-oracle-deck",
    kind: "Oracle",
    title: "Cosmic Journey Oracle",
    countLabel: "50 ใบ",
    price: 590,
    image: "/img/deck-cosmic.png",
    rating: 4.8,
  },
  {
    id: "blooming-heart-oracle-deck",
    kind: "Oracle",
    title: "Blooming Heart Oracle",
    countLabel: "44 ใบ",
    price: 520,
    image: "/img/deck-blooming.png",
    rating: 4.7,
  },
  {
    id: "witch-daily-tarot-deck",
    kind: "Tarot",
    title: "Witch's Daily Tarot",
    countLabel: "78 ใบ",
    price: 690,
    image: "/img/deck-witchdaily.png",
    badge: "ขายดี",
    rating: 4.9,
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
    title: "Magic Cat Tarot",
    category: "Deck · Tarot",
    price: 690,
    rating: 4.9,
    thumb: "/img/deck-cat.png",
  },
  {
    rank: 3,
    title: "Dreamy Unicorn Tarot",
    category: "Deck · Tarot",
    price: 690,
    rating: 4.8,
    thumb: "/img/deck-unicorn.png",
  },
  {
    rank: 4,
    title: "คู่มือ Moonlight Oracle",
    category: "E-book · คู่มือ",
    price: 290,
    rating: 4.9,
    thumb: "/img/ebook-moonlight.png",
  },
  {
    rank: 5,
    title: "Pastel Fairy Oracle",
    category: "Deck · Oracle",
    price: 590,
    rating: 4.8,
    thumb: "/img/deck-fairy.png",
  },
];
