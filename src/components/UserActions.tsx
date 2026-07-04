import Icon from "./Icon";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

interface UserActionsProps {
  onNavigate: (path: string) => void;
}

export default function UserActions({ onNavigate }: UserActionsProps) {
  const { t, language } = useLanguage();
  const {
    isConfigured,
    user,
    profile,
    displayName,
    avatarUrl,
    signInWithGoogle,
  } = useAuth();

  // signed out (Supabase configured): offer Google login instead of the mock user
  if (isConfigured && !user) {
    return (
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => void signInWithGoogle()}
          className="flex items-center gap-2.5 rounded-full border border-mystic-border-purple bg-white px-6 py-2.5 font-semibold text-mystic-ink shadow-pastel transition hover:scale-[1.03] hover:bg-mystic-lavender/40 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.2 3.7-8.6z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.1 0-5.8-2.1-6.8-5l-3.9 3C3.3 21.4 7.3 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.2 14.4A7.5 7.5 0 0 1 4.8 12c0-.8.2-1.6.4-2.4l-3.9-3A12 12 0 0 0 0 12c0 1.9.5 3.8 1.3 5.4l3.9-3z"
            />
            <path
              fill="#EA4335"
              d="M12 4.7c2.2 0 3.7 1 4.5 1.8l3.3-3.2C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.6 1.3 6.6l3.9 3c1-2.9 3.7-4.9 6.8-4.9z"
            />
          </svg>
          {language === "th" ? "เข้าสู่ระบบด้วย Google" : "Sign in with Google"}
        </button>
        <LanguageSwitcher />
      </div>
    );
  }

  const points = profile?.points ?? 250;

  return (
    <div className="flex items-center gap-4 md:gap-5">
      <div
        className="flex items-center gap-2.5 rounded-2xl border border-mystic-border/70 bg-mystic-pink-light px-5 py-2"
        aria-label={`${t.user.points} ${points}`}
      >
        <span className="text-lg" aria-hidden="true">
          ⭐
        </span>
        <div className="leading-tight">
          <p className="font-bold text-mystic-ink">{points}</p>
          <p className="text-xs text-mystic-muted">{t.user.points}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onNavigate("/notifications")}
        aria-label={t.user.notifications}
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
        onClick={() => onNavigate("/settings")}
        aria-label={`${t.user.profileMenuFor} ${displayName}`}
        className="flex items-center gap-2.5 transition-transform hover:scale-105"
      >
        <img
          src={avatarUrl}
          alt=""
          referrerPolicy="no-referrer"
          className="h-11 w-11 rounded-full object-cover shadow-pastel"
        />
        <span className="hidden max-w-36 truncate font-semibold text-mystic-ink sm:inline">
          {displayName}
        </span>
        <span className="text-mystic-ink/60" aria-hidden="true">
          ▾
        </span>
      </button>

      <LanguageSwitcher />
    </div>
  );
}
