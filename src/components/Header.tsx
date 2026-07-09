import UserActions from "./UserActions";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

interface HeaderProps {
  onNavigate: (path: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const { displayName } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h2 className="text-2xl font-extrabold text-mystic-ink md:text-[28px]">
          {t.home.greeting.replace("{name}", displayName)}
        </h2>
        <p className="mt-1.5 text-mystic-muted">{t.home.greetingSubtitle}</p>
      </div>

      <UserActions onNavigate={onNavigate} />
    </header>
  );
}
