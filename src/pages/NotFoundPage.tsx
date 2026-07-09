import { Link } from "react-router";
import { useLanguage } from "../i18n/LanguageContext";

export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[#EFE6F8] bg-white px-6 py-16 text-center">
        <span className="text-4xl" aria-hidden="true">
          🔮
        </span>
        <h3 className="text-lg font-bold text-mystic-ink-deep">
          {t.notFound.title}
        </h3>
        <Link
          to="/"
          className="rounded-full bg-gradient-to-r from-[#FF6FAE] to-[#F75FA2] px-7 py-2.5 font-bold text-white shadow-pastel transition hover:scale-[1.03] active:scale-95"
        >
          {t.notFound.backHome}
        </Link>
      </div>
    </div>
  );
}
