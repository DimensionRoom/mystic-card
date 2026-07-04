export type OwnedDeckType = "Tarot" | "Oracle";

export interface OwnedDeck {
  id: string;
  title: string;
  type: OwnedDeckType;
  cards: number;
  cover: string;
  favorite: boolean;
  /** display string for the last reading session, newest deck shows in the side panel */
  lastUsedAt?: string | null;
  hasEbook: boolean;
  /** in-app deck reading page, if this deck has one */
  link?: string;
}

export const ownedDecks: OwnedDeck[] = [
  {
    id: "dreamy-unicorn",
    title: "Dreamy Unicorn Tarot",
    type: "Tarot",
    cards: 78,
    cover: "/img/deck-unicorn.png",
    favorite: false,
    lastUsedAt: null,
    hasEbook: true,
    link: "/deck/dreamy-unicorn",
  },
  {
    id: "pastel-fairy",
    title: "Pastel Fairy Oracle",
    type: "Oracle",
    cards: 44,
    cover: "/img/deck-fairy.png",
    favorite: true,
    lastUsedAt: null,
    hasEbook: true,
    link: "/deck/pastel-fairy",
  },
  {
    id: "magic-cat",
    title: "Magic Cat Tarot",
    type: "Tarot",
    cards: 78,
    cover: "/img/deck-cat.png",
    favorite: true,
    lastUsedAt: "วันนี้ เวลา 10:24 น.",
    hasEbook: true,
    link: "/deck/magic-cat",
  },
  {
    id: "moonlight",
    title: "Moonlight Oracle",
    type: "Oracle",
    cards: 44,
    cover: "/img/deck-moon.png",
    favorite: false,
    lastUsedAt: null,
    hasEbook: true,
    link: "/deck/moonlight",
  },
  {
    id: "little-love",
    title: "Little Love Oracle",
    type: "Oracle",
    cards: 44,
    cover: "/img/deck-love.png",
    favorite: true,
    lastUsedAt: null,
    hasEbook: true,
    link: "/deck/little-love",
  },
  {
    id: "mystic-time",
    title: "Mystic Time Tarot",
    type: "Tarot",
    cards: 78,
    cover: "/img/deck-time.png",
    favorite: false,
    lastUsedAt: null,
    hasEbook: true,
    link: "/deck/mystic-time",
  },
  {
    id: "starlight",
    title: "Starlight Oracle",
    type: "Oracle",
    cards: 54,
    cover: "/img/deck-starlight.png",
    favorite: false,
    lastUsedAt: null,
    hasEbook: true,
  },
  {
    id: "crystal-wisdom",
    title: "Crystal Wisdom Oracle",
    type: "Oracle",
    cards: 45,
    cover: "/img/deck-crystal.png",
    favorite: false,
    lastUsedAt: null,
    hasEbook: true,
  },
  {
    id: "lovely-animal",
    title: "Lovely Animal Tarot",
    type: "Tarot",
    cards: 78,
    cover: "/img/deck-animal.png",
    favorite: false,
    lastUsedAt: null,
    hasEbook: true,
  },
  {
    id: "witch-daily",
    title: "Witch's Daily Tarot",
    type: "Tarot",
    cards: 78,
    cover: "/img/deck-witchdaily.png",
    favorite: false,
    lastUsedAt: null,
    hasEbook: true,
  },
];

/** the deck shown in the "ใช้งานล่าสุด" side panel */
export const lastUsedDeck = ownedDecks.find((d) => d.id === "magic-cat")!;
