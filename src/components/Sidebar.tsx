import Icon, { type IconName } from "./Icon";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

type MenuKey = "home" | "decks" | "readings" | "shop" | "settings";

const menuItems: { key: MenuKey; icon: IconName; path: string }[] = [
  { key: "home", icon: "home", path: "/" },
  { key: "decks", icon: "cards", path: "/decks" },
  { key: "readings", icon: "book", path: "/readings" },
  { key: "shop", icon: "bag", path: "/shop" },
  { key: "settings", icon: "settings", path: "/settings" },
];

interface SidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

export default function Sidebar({ activePath, onNavigate }: SidebarProps) {
  const { t } = useLanguage();
  const { isConfigured, user } = useAuth();
  // ซ่อน "การอ่านของฉัน" จนกว่าจะล็อกอินจริง (โหมด mock ล้วนไม่มี Supabase
  // ยังคงเห็นครบตามเดิม เพื่อให้สำรวจแอปได้โดยไม่ต้องตั้งค่า backend)
  const signedOut = isConfigured && !user;
  const visibleMenuItems = signedOut
    ? menuItems.filter(
        (item) => item.key !== "readings" && item.key !== "settings",
      )
    : menuItems;

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto bg-white px-5 py-6">
      {/* Logo */}
      <div className="flex flex-col items-center text-center">
        <img
          src="/img/logo.png"
          alt="แมวน้อยใส่หมวกแม่มด สัญลักษณ์ Mystic Card"
          className="h-24 w-auto mix-blend-multiply [mask-image:radial-gradient(ellipse_60%_58%_at_center,black_62%,transparent_98%)]"
        />
        <h1 className="mt-1 text-2xl font-extrabold tracking-wide text-mystic-ink">
          MYSTIC CARD
        </h1>
        <p className="text-sm text-mystic-muted">Oracle &amp; Tarot Online</p>
      </div>

      {/* Menu */}
      <nav aria-label={t.sidebar.nav}>
        <ul className="flex flex-col gap-1">
          {visibleMenuItems.map((item) => {
            const active = item.path === activePath;
            return (
              <li key={item.path}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.path)}
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-3.5 rounded-2xl px-4 py-2.5 text-left text-[15px] font-medium transition-colors ${
                    active
                      ? "bg-mystic-pink-soft text-mystic-pink shadow-pastel"
                      : "text-mystic-ink/75 hover:bg-mystic-pink-light hover:text-mystic-pink"
                  }`}
                >
                  <Icon name={item.icon} className="h-[19px] w-[19px] shrink-0" />
                  {t.sidebar[item.key]}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Premium card */}
      <section
        aria-label={t.sidebar.premiumTitle}
        className="rounded-bubble border border-mystic-border bg-mystic-pink-light p-5"
      >
        <h2 className="flex items-center gap-2 text-[15px] font-bold text-mystic-pink">
          <span aria-hidden="true">👑</span> {t.sidebar.premiumTitle}
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-mystic-ink/80">
          {[
            t.sidebar.benefit1,
            t.sidebar.benefit2,
            t.sidebar.benefit3,
            t.sidebar.benefit4,
          ].map((benefit) => (
            <li key={benefit} className="flex items-start gap-2">
              <span className="font-bold text-mystic-pink" aria-hidden="true">
                ✓
              </span>
              {benefit}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onNavigate("/premium")}
          className="mt-4 w-full rounded-full bg-gradient-to-r from-mystic-pink to-mystic-purple-soft px-4 py-2.5 font-bold text-white shadow-pastel transition-transform hover:scale-[1.03] active:scale-95"
        >
          {t.sidebar.premiumCta}
        </button>
      </section>

      {/* Sleeping mascot */}
      <img
        src="/img/mascot.png"
        alt="แมวน้อยนอนหลับบนก้อนเมฆ"
        className="animate-float-slow mx-auto mt-auto w-40"
      />
    </div>
  );
}
