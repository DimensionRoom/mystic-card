export default function UniverseMessage() {
  return (
    <article className="flex flex-col items-center rounded-bubble border border-mystic-border-purple/70 bg-gradient-to-b from-mystic-lavender via-[#FBEFF7] to-mystic-pink-light p-6 text-center shadow-pastel">
      <h4 className="font-bold text-mystic-ink">ข้อความจากจักรวาลถึงคุณ</h4>

      <img
        src="/img/envelope.png"
        alt="ซองจดหมายมีปีกและหัวใจ"
        className="animate-float-slow my-5 w-44 mix-blend-multiply"
      />

      <blockquote className="text-mystic-ink/85">
        <p className="font-semibold">“จงเชื่อมั่นในเส้นทางของตัวเอง”</p>
        <p className="mt-1.5 text-sm text-mystic-ink/65">
          ทุกก้าวที่คุณเดิน กำลังพาคุณไปในที่ที่ดีเสมอ
        </p>
      </blockquote>

      <span className="mt-4 text-xl text-mystic-pink" aria-hidden="true">
        💗
      </span>
    </article>
  );
}
