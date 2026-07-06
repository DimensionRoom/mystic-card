import { useEffect, useState } from "react";

interface OracleCardImageProps {
  src?: string;
  /** ภาพสำรองเมื่อ src โหลดไม่ได้ (เช่น หน้าไพ่ยังไม่มีไฟล์จริง) — ปกติใช้หลังไพ่ */
  fallbackSrc?: string;
  alt: string;
  className?: string;
}

/** card art with a graceful fallback (card back, then a CSS gradient) when no asset exists */
export default function OracleCardImage({
  src,
  fallbackSrc,
  alt,
  className = "",
}: OracleCardImageProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  const resolved = !src || failed ? fallbackSrc : src;

  if (!resolved) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center rounded-[18px] border border-[#E9D8FF] bg-gradient-to-b from-[#6f58b8] via-[#8d76c9] to-[#d9c2ec] shadow-pastel ${className}`}
      >
        <span className="text-4xl" aria-hidden="true">
          🌙
        </span>
      </div>
    );
  }
  return (
    <img
      src={resolved}
      alt={alt}
      onError={() => setFailed(true)}
      className={`rounded-[18px] border border-[#E9D8FF] object-cover shadow-pastel ${className}`}
    />
  );
}
