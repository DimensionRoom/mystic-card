// sub-view id ทั้งหมด (ไม่รวม "main") — แชร์ให้ SettingsPage, SettingsRoute, และ
// router/paths.ts ใช้ตรวจสอบ param เดียวกัน กัน drift ของรายการ id
//
// โมดูลนี้ตั้งใจให้ "เบา" ที่สุด (ไม่มี React/component import ใด ๆ) เพราะ
// router/paths.ts ถูก import แบบ eager (ไม่ lazy) จาก useAppNavigate.ts การ
// import ค่าคงที่นี้จากไฟล์ component ที่หนัก (SettingsPage.tsx) จะดึงทั้ง
// SettingsPage และลูกของมันเข้า eager bundle ไปด้วย ทำลาย code-split ของ
// lazy(() => import("./pages/SettingsRoute")) ใน App.tsx
export const SETTINGS_SUB_VIEWS = [
  "profile",
  "email",
  "password",
  "notifications",
  "reading-preferences",
  "help",
  "privacy",
  "terms",
] as const;

export type SettingsSubView = (typeof SETTINGS_SUB_VIEWS)[number];
