import UserActions from "./UserActions";
import { useAuth } from "../auth/AuthContext";

interface HeaderProps {
  onNavigate: (path: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const { displayName } = useAuth();

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h2 className="text-2xl font-extrabold text-mystic-ink md:text-[28px]">
          สวัสดี {displayName} <span aria-hidden="true">💗</span>
        </h2>
        <p className="mt-1.5 text-mystic-muted">
          วันนี้อยากให้ไพ่อะไรกับคุณดีนะ? <span aria-hidden="true">✨</span>
        </p>
      </div>

      <UserActions onNavigate={onNavigate} />
    </header>
  );
}
