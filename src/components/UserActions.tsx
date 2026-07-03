import Icon from "./Icon";

interface UserActionsProps {
  onNavigate: (path: string) => void;
}

export default function UserActions({ onNavigate }: UserActionsProps) {
  return (
    <div className="flex items-center gap-4 md:gap-5">
      <div
        className="flex items-center gap-2.5 rounded-2xl border border-mystic-border/70 bg-mystic-pink-light px-5 py-2"
        aria-label="คะแนนของคุณ 250 คะแนน"
      >
        <span className="text-lg" aria-hidden="true">
          ⭐
        </span>
        <div className="leading-tight">
          <p className="font-bold text-mystic-ink">250</p>
          <p className="text-xs text-mystic-muted">คะแนนของคุณ</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onNavigate("/notifications")}
        aria-label="การแจ้งเตือน มีรายการใหม่"
        className="relative p-1 text-mystic-ink/80 transition-transform hover:scale-110"
      >
        <Icon name="bell" className="h-6 w-6" />
        <span
          className="absolute right-0 top-0.5 h-2.5 w-2.5 rounded-full bg-mystic-pink"
          aria-hidden="true"
        />
      </button>

      <button
        type="button"
        onClick={() => onNavigate("/profile")}
        aria-label="เมนูโปรไฟล์ของ น้องดาว"
        className="flex items-center gap-2.5 transition-transform hover:scale-105"
      >
        <img
          src="/img/avatar.png"
          alt=""
          className="h-11 w-11 rounded-full object-cover shadow-pastel"
        />
        <span className="hidden font-semibold text-mystic-ink sm:inline">
          น้องดาว
        </span>
        <span className="text-mystic-ink/60" aria-hidden="true">
          ▾
        </span>
      </button>
    </div>
  );
}
