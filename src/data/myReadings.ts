export interface ReadingItem {
  id: string;
  deckName: string;
  deckType: "Oracle" | "Tarot";
  cover: string;
  title: string;
  date: string;
  time: string;
  cardCount: number;
  category?: string;
  preview: string;
  isFavorite: boolean;
  /** newest = largest, used by the "ล่าสุด" filter */
  sortKey: number;
}

export const myReadings: ReadingItem[] = [
  {
    id: "reading-001",
    deckName: "Moonlight Oracle",
    deckType: "Oracle",
    cover: "/img/deck-cover.png",
    title: "ตอนนี้ฉันควรโฟกัสกับอะไรเป็นพิเศษ?",
    date: "10 พ.ค. 2567",
    time: "21:45",
    cardCount: 3,
    preview:
      "ไพ่แนะนำให้คุณหันมาใส่ใจความสงบภายใน ปล่อยวางสิ่งที่ควบคุมไม่ได้ และเชื่อมั่นในจังหวะของชีวิต...",
    isFavorite: true,
    sortKey: 4,
  },
  {
    id: "reading-002",
    deckName: "Dreamy Unicorn Tarot",
    deckType: "Tarot",
    cover: "/img/cover-unicorn.png",
    title: "ความรักของเราจะไปต่อได้ไหม?",
    date: "5 พ.ค. 2567",
    time: "19:10",
    cardCount: 5,
    category: "ความสัมพันธ์",
    preview:
      "ไพ่บอกว่าความสัมพันธ์นี้มีศักยภาพ แต่ต้องอาศัยการเปิดใจพูดคุยและทำความเข้าใจกันมากขึ้น...",
    isFavorite: false,
    sortKey: 3,
  },
  {
    id: "reading-003",
    deckName: "Magic Cat Tarot",
    deckType: "Tarot",
    cover: "/img/cover-magic-cat.png",
    title: "สิ่งที่กำลังจะเกิดขึ้นในอีกไม่กี่สัปดาห์",
    date: "1 พ.ค. 2567",
    time: "14:32",
    cardCount: 3,
    preview:
      "มีการเปลี่ยนแปลงที่ดีเข้ามา มีโอกาสใหม่ ๆ และข่าวดีที่ทำให้คุณยิ้มได้ เตรียมตัวรับความสุข...",
    isFavorite: true,
    sortKey: 2,
  },
  {
    id: "reading-004",
    deckName: "Moonlight Oracle",
    deckType: "Oracle",
    cover: "/img/deck-cover.png",
    title: "ข้อความจากจักรวาลสำหรับฉันในวันนี้",
    date: "28 เม.ย. 2567",
    time: "09:15",
    cardCount: 1,
    preview:
      "จงเชื่อมั่นในตัวเองและแสงสว่างในหัวใจของคุณ คุณมีพลังมากกว่าที่คุณคิด...",
    isFavorite: false,
    sortKey: 1,
  },
];

export interface ReadingNote {
  id: string;
  quote: string;
  date: string;
  deckName: string;
  thumb: string;
}

export const readingNotes: ReadingNote[] = [
  {
    id: "note-1",
    quote:
      "“การปล่อยวาง ไม่ได้แปลว่าการยอมแพ้ แต่คือการไว้ใจว่า จักรวาลจะพาเราไปในที่ที่ดีขึ้นเสมอ” ✨",
    date: "10 พ.ค. 2567",
    deckName: "Moonlight Oracle",
    thumb: "/img/deck-moon.png",
  },
  {
    id: "note-2",
    quote: "“ความรักที่แท้จริง เริ่มจากการรักตัวเองให้มากพอ” 💜",
    date: "5 พ.ค. 2567",
    deckName: "Dreamy Unicorn Tarot",
    thumb: "/img/deck-unicorn.png",
  },
  {
    id: "note-3",
    quote: "“ทุกการเริ่มต้นใหม่ คือโอกาสที่สวยงามของชีวิต” ✨",
    date: "1 พ.ค. 2567",
    deckName: "Magic Cat Tarot",
    thumb: "/img/deck-cat.png",
  },
];

export const readingStats = [
  {
    label: "อ่านทั้งหมด",
    value: "58",
    unit: "ครั้ง",
    caption: "ตั้งแต่เข้าร่วม",
    icon: "/img/stat-book.png",
    valueClass: "text-mystic-purple",
    bgClass: "from-white to-[#FBF7FF]",
  },
  {
    label: "อ่านเดือนนี้",
    value: "12",
    unit: "ครั้ง",
    caption: "↑ 3 จากเดือนที่แล้ว",
    icon: "/img/stat-calendar.png",
    valueClass: "text-mystic-pink-deep",
    bgClass: "from-white to-[#FFF5FA]",
  },
  {
    label: "รายการโปรด",
    value: "18",
    unit: "รายการ",
    caption: "ไพ่ที่คุณชื่นชอบ",
    icon: "/img/stat-heart.png",
    valueClass: "text-mystic-pink-deep",
    bgClass: "from-white to-[#FFF7F3]",
  },
  {
    label: "บันทึกไว้",
    value: "26",
    unit: "โน้ต",
    caption: "ข้อความที่คุณเซฟไว้",
    icon: "/img/stat-notebook.png",
    valueClass: "text-mystic-purple",
    bgClass: "from-white to-[#FBF7FF]",
  },
];
