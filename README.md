# Mystic Card — Oracle & Tarot Online 🐱✨

หน้า Home ของเว็บแอปเลือก Deck ไพ่ Oracle/Tarot เล่นออนไลน์ พร้อมปุ่มซื้อ E-book ของแต่ละ Deck
สไตล์ Pastel / Kawaii / Magical รองรับภาษาไทยเต็มรูปแบบ (ฟอนต์ Noto Sans Thai)

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS v4 (ผ่าน `@tailwindcss/vite`)
- Vite 6
- ข้อมูล mock ทั้งหมดอยู่ใน `src/data/decks.ts` — ไม่มีการเรียก API จริง
- ภาพประกอบใน `public/img/` crop มาจากภาพ design ต้นฉบับ (โลโก้, ฮีโร่, ปกไพ่ทั้ง 6, mascot ฯลฯ)

## เริ่มใช้งาน

```bash
npm install
npm run dev      # เปิด dev server
npm run build    # ตรวจ type + build โปรดักชัน
```

## โครงสร้าง

```
src/
  App.tsx                    # layout หลัก, mock router (Home / Deck / My Readings), drawer, toast
  data/decks.ts              # mock data ของ deck และการอ่านล่าสุด
  components/
    DeckReadingPage.tsx      # หน้าอ่านไพ่ของแต่ละ Deck (/deck/:id) + result modal
    DeckHeader.tsx           # ปุ่มกลับ + ชื่อ deck + badges
    DeckTabs.tsx             # แท็บ อ่านไพ่ / ความหมายไพ่ / เกี่ยวกับ Deck
    ReadingTypePanel.tsx     # ข้อมูล deck + รูปแบบการอ่าน 1/3/5 ใบ (เฉพาะ tab อ่านไพ่)
    my-readings/
      MyReadingsPage.tsx     # หน้า "การอ่านของฉัน" (/readings): สถิติ + ค้นหา/กรอง + โน้ต
      ReadingHistoryItem.tsx # รายการอ่านย้อนหลัง: ปก + ปุ่มดูผล/โน้ต + โปรด + เมนู ⋮
    shop/
      ShopPage.tsx           # หน้า "ร้านค้า" (/shop): filter/ค้นหา/sort + aside + banner
      ProductCard.tsx        # การ์ดสินค้า Deck / E-book
    deck/
      CardMeaningTab.tsx     # tab ความหมายไพ่: ค้นหา + รายการไพ่ + รายละเอียด + โปรด
      AboutDeckTab.tsx       # tab เกี่ยวกับ Deck: about + รายละเอียด + ตัวอย่างไพ่ + E-book panel
      OracleCardImage.tsx    # ภาพไพ่พร้อม gradient fallback เมื่อไม่มี asset
    DeckRecentReadings.tsx   # การอ่านล่าสุดแบบแถวนอนของหน้า deck
    moonlight-oracle/        # กระดานอ่านไพ่ (โครงเดียว ใช้ทั้งเลือกและเปิดไพ่)
      ReadingBoard.tsx       #   board รวมสองโหมด: เลือกไพ่คว่ำ → เปิดทีละใบในที่เดิม
      RevealCard.tsx         #   ไพ่ 4 สถานะ: เปิดแล้ว / กำลังเปิด / รอเปิด / จาง (ไม่ได้เลือก)
      RevealProgress.tsx     #   pill สถานะ "เลือกแล้ว/ใบที่ X จาก N" + dots
      ReadingActionBar.tsx   #   ปุ่มหลัก (เริ่มอ่าน→เปิดใบถัดไป→ดูคำทำนาย) + สับไพ่
    Icon.tsx                 # ชุด line icons (SVG stroke)
    UserActions.tsx          # คะแนน + กระดิ่ง + avatar (ใช้ร่วมสองหน้า)
    Sidebar.tsx              # sidebar (desktop) + เนื้อหาใน drawer (tablet/mobile)
    BottomNav.tsx            # bottom navigation บนมือถือ
    Header.tsx               # ทักทาย + คะแนน + แจ้งเตือน + โปรไฟล์
    HeroBanner.tsx           # แบนเนอร์ "เปิดไพ่ รับคำแนะนำจากจักรวาล"
    DeckShelf.tsx            # แถว Deck แบบ carousel พร้อมลูกศรเลื่อน
    DeckCard.tsx             # การ์ด Deck (ปุ่ม เลือก / E-book)
    RecentReadings.tsx       # การอ่านล่าสุดของคุณ
    UniverseMessage.tsx      # ข้อความจากจักรวาล
    RandomCard.tsx           # สุ่มไพ่ทำนายใจ
```

## Responsive

- **Desktop ≥ 1280px** — sidebar ตรึงซ้าย 260px, deck เป็นแถวเลื่อนแนวนอนพร้อมลูกศร, การ์ดล่าง 3 คอลัมน์
- **Tablet 768–1279px** — sidebar กลายเป็น drawer (ปุ่ม ☰), deck ~3 ใบต่อจอ, การ์ดล่าง 2 คอลัมน์ + ใบสุดท้ายเต็มแถว
- **Mobile < 768px** — bottom navigation + drawer, hero เรียงแนวตั้ง, deck 1–2 คอลัมน์, ปุ่มสูง ≥ 40px

การกด "เลือก" / "E-book" จะจำลองการ navigate ไป `/deck/:id` และ `/deck/:id/ebook` โดยแสดงเป็น toast (ยังไม่ต่อ router จริง)
