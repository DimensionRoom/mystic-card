import { useEffect, useState } from "react";

interface CardFaceProps {
  /** ภาพหน้าไพ่ (อาจยังไม่มีไฟล์จริง) */
  src?: string;
  /** ภาพสำรองเมื่อ src ว่างหรือโหลดไม่ได้ — ปกติใช้หลังไพ่ของ deck */
  fallback: string;
  alt: string;
  className?: string;
}

/**
 * รูปหน้าไพ่ที่ fallback ไปยังหลังไพ่ของ deck โดยอัตโนมัติเมื่อยังไม่มีภาพจริง
 * (เช่น เพิ่งวางไฟล์ลง /img/decks/<deck>/NN.png ไม่ครบทุกใบ) จึงไม่มีภาพแตก
 */
export default function CardFace({
  src,
  fallback,
  alt,
  className = "",
}: CardFaceProps) {
  const [failed, setFailed] = useState(false);
  // เปลี่ยนไพ่/เปลี่ยน src → รีเซ็ตสถานะ error เพื่อให้ลองโหลดภาพจริงใหม่
  useEffect(() => setFailed(false), [src]);

  return (
    <img
      src={!src || failed ? fallback : src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
