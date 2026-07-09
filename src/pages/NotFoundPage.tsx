import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[#EFE6F8] bg-white px-6 py-16 text-center">
        <span className="text-4xl" aria-hidden="true">
          🔮
        </span>
        <h3 className="text-lg font-bold text-mystic-ink-deep">
          ไม่พบหน้าที่คุณตามหา ✨
        </h3>
        <Link
          to="/"
          className="rounded-full bg-gradient-to-r from-[#FF6FAE] to-[#F75FA2] px-7 py-2.5 font-bold text-white shadow-pastel transition hover:scale-[1.03] active:scale-95"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}
