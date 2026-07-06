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
    id: "moonlight",
    title: "Moonlight Oracle",
    type: "Oracle",
    cards: 44,
    cover: "/img/deck-moon.png",
    favorite: false,
    lastUsedAt: "วันนี้ เวลา 10:24 น.",
    hasEbook: true,
    link: "/deck/moonlight",
  },
  {
    id: "cutie-cat",
    title: "Cutie Cat Tarot",
    type: "Tarot",
    cards: 78,
    cover: "/img/deck-cutie-cat.png",
    favorite: false,
    lastUsedAt: null,
    hasEbook: true,
    link: "/deck/cutie-cat",
  },
];

/** the deck shown in the "ใช้งานล่าสุด" side panel */
export const lastUsedDeck = ownedDecks.find((d) => d.id === "moonlight")!;
