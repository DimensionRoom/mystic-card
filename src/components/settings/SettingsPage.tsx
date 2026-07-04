import { useEffect, useRef, useState } from "react";
import Icon, { type IconName } from "../Icon";
import UserActions from "../UserActions";
import { useAuth } from "../../auth/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";
import SubPage from "./SubPage";
import {
  EmailSettings,
  HelpCenter,
  NotificationSettings,
  PasswordSettings,
  PrivacyPolicy,
  ProfileSettings,
  ReadingSettings,
  TermsOfService,
} from "./views";

type SettingsView =
  | "main"
  | "profile"
  | "email"
  | "password"
  | "notifications"
  | "reading-preferences"
  | "help"
  | "privacy"
  | "terms";

interface SettingsRow {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  type?: "default" | "danger";
}

interface SettingsSectionProps {
  title: string;
  rows: SettingsRow[];
  onRowClick: (row: SettingsRow) => void;
}

function SettingsSection({ title, rows, onRowClick }: SettingsSectionProps) {
  return (
    <section
      aria-label={title}
      className="rounded-[24px] border border-[#E8DEF7] bg-white p-4 shadow-[0_8px_24px_rgba(124,92,250,0.08)] md:p-5"
    >
      <h3 className="px-2 pb-2 pt-1 font-bold text-mystic-purple">{title}</h3>
      <ul className="flex flex-col divide-y divide-[#F0EAF9]">
        {rows.map((row) => {
          const danger = row.type === "danger";
          return (
            <li key={row.id}>
              <button
                type="button"
                onClick={() => onRowClick(row)}
                className="flex w-full items-center gap-4 rounded-[18px] px-2 py-4 text-left transition-colors hover:bg-mystic-lavender/40 md:px-3"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                    danger
                      ? "bg-[#FFE7E7] text-[#FF6B6B]"
                      : "bg-[#EFE7FF] text-mystic-purple"
                  }`}
                >
                  <Icon name={row.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-mystic-ink-deep">
                    {row.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-mystic-muted">
                    {row.description}
                  </span>
                </span>
                <span className="shrink-0 text-mystic-muted" aria-hidden="true">
                  ›
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

interface SettingsPageProps {
  onNavigate: (path: string) => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { t, language } = useLanguage();
  const { isConfigured, user, displayName, signOut, signInWithGoogle } =
    useAuth();
  const [view, setView] = useState<SettingsView>("main");
  const [showLogout, setShowLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // ต้องล็อกอินก่อนถึงจะเข้าหน้าตั้งค่าได้ — กันไว้ตรงนี้จุดเดียว
  // เผื่อมีทางเข้าอื่นนอกจากเมนู (เช่นเดียวกับ MyReadingsPage)
  if (isConfigured && !user) {
    return (
      <div className="flex flex-col gap-6">
        <header className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-mystic-ink-deep md:text-[30px]">
              {t.settings.title}
            </h2>
            <p className="mt-1.5 text-mystic-muted">
              {t.settings.subtitle} <span aria-hidden="true">✨</span>
            </p>
          </div>
          <UserActions onNavigate={onNavigate} />
        </header>

        <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[#F0DFF3] bg-white/90 px-6 py-16 text-center shadow-[0_12px_32px_rgba(139,92,246,0.08)]">
          <span className="text-4xl" aria-hidden="true">
            🔮
          </span>
          <h3 className="text-lg font-bold text-mystic-ink-deep">
            เข้าสู่ระบบเพื่อจัดการบัญชีและการตั้งค่าของคุณ
          </h3>
          <p className="max-w-sm text-sm text-mystic-muted">
            ล็อกอินด้วย Google เพื่อดูและแก้ไขข้อมูลโปรไฟล์ การแจ้งเตือน
            และการตั้งค่าอื่น ๆ ของบัญชีคุณ
          </p>
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
        </div>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  };

  const accountSettings: SettingsRow[] = [
    {
      id: "profile",
      title: t.settings.profileTitle,
      description: t.settings.profileDesc,
      icon: "user",
    },
    {
      id: "email",
      title: t.settings.emailTitle,
      description: t.settings.emailDesc,
      icon: "mail",
    },
    {
      id: "password",
      title: t.settings.passwordTitle,
      description: t.settings.passwordDesc,
      icon: "lock",
    },
  ];

  const appSettings: SettingsRow[] = [
    {
      id: "notifications",
      title: t.settings.notificationsTitle,
      description: t.settings.notificationsDesc,
      icon: "bell",
    },
    {
      id: "reading-preferences",
      title: t.settings.readingPrefTitle,
      description: t.settings.readingPrefDesc,
      icon: "file-text",
    },
  ];

  const moreSettings: SettingsRow[] = [
    {
      id: "help",
      title: t.settings.helpTitle,
      description: t.settings.helpDesc,
      icon: "help",
    },
    {
      id: "privacy",
      title: t.settings.privacyTitle,
      description: t.settings.privacyDesc,
      icon: "shield-check",
    },
    {
      id: "terms",
      title: t.settings.termsTitle,
      description: t.settings.termsDesc,
      icon: "file-text",
    },
    {
      id: "logout",
      title: t.settings.logoutTitle,
      description: t.settings.logoutDesc,
      icon: "logout",
      type: "danger",
    },
  ];

  const confirmLogout = async () => {
    if (!user) {
      // mock mode: nothing to await, just close and confirm
      setShowLogout(false);
      showToast(t.settings.logoutToast);
      return;
    }
    setLoggingOut(true);
    await signOut();
    setLoggingOut(false);
    setShowLogout(false);
    setView("main"); // don't leave a stale sub-page (e.g. profile) showing
    showToast(t.settings.logoutToast);
    onNavigate("/"); // land back on Home like a fresh, signed-out visit
  };

  const handleRow = (row: SettingsRow) => {
    if (row.id === "logout") setShowLogout(true);
    else setView(row.id as SettingsView);
  };

  // เมื่อคลิก avatar ใน UserActions ขณะอยู่หน้านี้แล้ว ให้เปิดข้อมูลส่วนตัว
  // ในหน้าเดิมเลยแทนที่จะ navigate ไป "/settings" ซ้ำ (ซึ่งไม่มีผลอะไร)
  const handleUserActionsNavigate = (path: string) => {
    if (path === "/settings") setView("profile");
    else onNavigate(path);
  };

  // sub-page metadata comes from the same rows shown on the main list
  const allRows = [...accountSettings, ...appSettings, ...moreSettings];
  const activeRow = allRows.find((r) => r.id === view);

  const subViews: Record<string, React.ReactNode> = {
    profile: <ProfileSettings showToast={showToast} />,
    email: <EmailSettings showToast={showToast} />,
    password: <PasswordSettings showToast={showToast} />,
    notifications: <NotificationSettings showToast={showToast} />,
    "reading-preferences": <ReadingSettings showToast={showToast} />,
    help: <HelpCenter showToast={showToast} />,
    privacy: <PrivacyPolicy />,
    terms: <TermsOfService />,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* page header */}
      <header className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-mystic-ink-deep md:text-[30px]">
            {t.settings.title}
          </h2>
          <p className="mt-1.5 text-mystic-muted">
            {t.settings.subtitle} <span aria-hidden="true">✨</span>
          </p>
        </div>

        {/* ปุ่มเดียวกับทุกหน้า: ล็อกอินด้วย Google เมื่อยังไม่ได้ล็อกอิน,
            หรือคะแนน/แจ้งเตือน/โปรไฟล์จริงเมื่อล็อกอินแล้ว — เดิม Settings
            มีปุ่มโปรไฟล์แยกของตัวเองที่ไม่เคยเสนอปุ่มล็อกอินเลย ทำให้ดูเหมือน
            ค้างเป็น "น้องดาว" ทั้งที่จริง ๆ ยังไม่ได้ล็อกอิน */}
        <UserActions onNavigate={handleUserActionsNavigate} />
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {view !== "main" && activeRow ? (
          <SubPage
            title={activeRow.title}
            description={activeRow.description}
            backLabel={t.settings.backToSettings}
            onBack={() => setView("main")}
          >
            {subViews[view]}
          </SubPage>
        ) : (
          <>
            <SettingsSection
              title={t.settings.sectionAccount}
              rows={accountSettings}
              onRowClick={handleRow}
            />
            <SettingsSection
              title={t.settings.sectionApp}
              rows={appSettings}
              onRowClick={handleRow}
            />
            <SettingsSection
              title={t.settings.sectionMore}
              rows={moreSettings}
              onRowClick={handleRow}
            />

            <p className="pb-2 text-center text-sm text-mystic-muted">
              {t.settings.version} 1.0.0
            </p>
          </>
        )}
      </div>

      {/* logout confirm dialog */}
      {showLogout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t.settings.logoutConfirmTitle}
        >
          <button
            type="button"
            aria-label={t.settings.cancel}
            onClick={() => !loggingOut && setShowLogout(false)}
            disabled={loggingOut}
            className="absolute inset-0 bg-mystic-ink/40 backdrop-blur-sm disabled:cursor-not-allowed"
          />
          <div className="animate-toast-in relative w-full max-w-sm rounded-bubble-lg bg-white p-6 text-center shadow-pastel-lg">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE7E7] text-[#FF6B6B]">
              <Icon name="logout" className="h-6 w-6" />
            </span>
            <h3 className="mt-3 font-extrabold text-mystic-ink-deep">
              {t.settings.logoutConfirmTitle}
            </h3>
            <p className="mt-1.5 text-sm text-mystic-muted">
              {t.settings.logoutConfirmBody1.replace("{name}", displayName)}
              <br />
              {t.settings.logoutConfirmBody2}
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => void confirmLogout()}
                disabled={loggingOut}
                aria-busy={loggingOut}
                className="flex items-center justify-center gap-2 rounded-full bg-[#FF6B6B] px-7 py-2.5 font-bold text-white shadow-pastel transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:scale-100"
              >
                {loggingOut && (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    aria-hidden="true"
                  />
                )}
                {loggingOut
                  ? t.settings.loggingOut
                  : t.settings.logoutConfirmAction}
              </button>
              <button
                type="button"
                onClick={() => setShowLogout(false)}
                disabled={loggingOut}
                className="rounded-full border border-mystic-border px-7 py-2.5 font-semibold text-mystic-ink/70 transition-colors hover:bg-mystic-pink-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t.settings.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      {toast && (
        <div
          role="status"
          className="animate-toast-in fixed bottom-20 left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-full bg-mystic-ink px-5 py-2.5 text-sm font-semibold text-white shadow-pastel-lg md:bottom-8"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
