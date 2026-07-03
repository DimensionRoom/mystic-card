import Icon, { type IconName } from "./Icon";

const items: { label: string; icon: IconName; path: string }[] = [
  { label: "หน้าหลัก", icon: "home", path: "/" },
  { label: "เลือกไพ่", icon: "cards", path: "/decks" },
  { label: "การอ่าน", icon: "book", path: "/readings" },
  { label: "ร้านค้า", icon: "bag", path: "/shop" },
  { label: "โปรไฟล์", icon: "user", path: "/profile" },
];

interface BottomNavProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

export default function BottomNav({ activePath, onNavigate }: BottomNavProps) {
  return (
    <nav
      aria-label="เมนูหลักบนมือถือ"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-mystic-border bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="flex">
        {items.map((item) => {
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
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
