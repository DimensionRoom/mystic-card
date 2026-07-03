import Icon, { type IconName } from "./Icon";

export type DeckTab = "read" | "meaning" | "about";

const tabs: { id: DeckTab; label: string; icon: IconName }[] = [
  { id: "read", label: "อ่านไพ่", icon: "cards" },
  { id: "meaning", label: "ความหมายไพ่", icon: "sparkles" },
  { id: "about", label: "เกี่ยวกับ Deck", icon: "info" },
];

interface DeckTabsProps {
  active: DeckTab;
  onChange: (tab: DeckTab) => void;
}

export default function DeckTabs({ active, onChange }: DeckTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="เมนูของ Deck"
      className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto rounded-[18px] border border-mystic-border bg-[#FFF9FD] p-2"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex shrink-0 items-center justify-center gap-2.5 rounded-[14px] border px-5 py-3 text-[15px] font-semibold transition-all md:flex-1 ${
              isActive
                ? "border-mystic-border-purple/50 bg-white text-mystic-ink-deep shadow-[0_8px_20px_rgba(116,86,174,0.14)]"
                : "border-transparent text-mystic-ink/55 hover:text-mystic-purple"
            }`}
          >
            <Icon
              name={tab.icon}
              className={`h-[18px] w-[18px] ${isActive ? "text-mystic-purple" : ""}`}
            />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
