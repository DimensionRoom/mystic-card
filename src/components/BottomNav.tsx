import Icon, { type IconName } from "./Icon";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

type NavKey = "home" | "decks" | "readings" | "shop" | "profile";

const items: { key: NavKey; icon: IconName; path: string }[] = [
  { key: "home", icon: "home", path: "/" },
  { key: "decks", icon: "cards", path: "/decks" },
  { key: "readings", icon: "book", path: "/readings" },
  { key: "shop", icon: "bag", path: "/shop" },
  { key: "profile", icon: "user", path: "/profile" },
];

interface BottomNavProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

export default function BottomNav({ activePath, onNavigate }: BottomNavProps) {
  const { t } = useLanguage();
  const { isConfigured, user } = useAuth();
  const signedOut = isConfigured && !user;
  const visibleItems = signedOut
    ? items.filter((item) => item.key !== "readings")
    : items;

  return (
    <nav
      aria-label={t.bottomNav.nav}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-mystic-border bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="flex">
        {visibleItems.map((item) => {
          const active = item.path === activePath;
          return (
            <li key={item.path} className="flex-1">
              <button
                type="button"
                onClick={() => onNavigate(item.path)}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 w-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                  active ? "text-mystic-pink" : "text-mystic-muted"
                }`}
              >
                <Icon name={item.icon} className="h-5 w-5" />
                {t.bottomNav[item.key]}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
