import { useEffect, useRef, useState } from "react";
import Icon, { type IconName } from "../Icon";
import { useAuth } from "../../auth/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { languageNames, type Language } from "../../i18n/translations";
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
  language: string;
  onRowClick: (row: SettingsRow) => void;
}

function SettingsSection({
  title,
  rows,
  language,
  onRowClick,
}: SettingsSectionProps) {
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
                {row.id === "language" && (
                  <span className="shrink-0 font-bold text-mystic-purple">
                    {language}
                  </span>
                )}
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
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [view, setView] = useState<SettingsView>("main");
  const [showLanguage, setShowLanguage] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

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
      id: "language",
      title: t.settings.languageTitle,
      description: t.settings.languageDesc,
      icon: "globe",
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
    if (row.id === "language") setShowLanguage(true);
    else if (row.id === "logout") setShowLogout(true);
    else setView(row.id as SettingsView);
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

        <div className="flex items-center gap-4">
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
            onClick={() => setView("profile")}
            aria-label={`${t.user.profileMenuFor} ${profile?.display_name ?? "น้องดาว"}`}
            className="flex items-center gap-2.5 transition-transform hover:scale-105"
          >
            <img
              src={profile?.avatar_url ?? "/img/avatar.png"}
              alt=""
              referrerPolicy="no-referrer"
              className="h-11 w-11 rounded-full object-cover shadow-pastel"
            />
            <span className="hidden max-w-36 truncate font-semibold text-mystic-ink sm:inline">
              {profile?.display_name ?? "น้องดาว"}
            </span>
            <span className="text-mystic-ink/60" aria-hidden="true">
              ▾
            </span>
          </button>
        </div>
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
              language={languageNames[language]}
              onRowClick={handleRow}
            />
            <SettingsSection
              title={t.settings.sectionApp}
              rows={appSettings}
              language={languageNames[language]}
              onRowClick={handleRow}
            />
            <SettingsSection
              title={t.settings.sectionMore}
              rows={moreSettings}
              language={languageNames[language]}
              onRowClick={handleRow}
            />

            <p className="pb-2 text-center text-sm text-mystic-muted">
              {t.settings.version} 1.0.0
            </p>
          </>
        )}
      </div>

      {/* language selector modal */}
      {showLanguage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t.settings.chooseLanguage}
        >
          <button
            type="button"
            aria-label={t.settings.close}
            onClick={() => setShowLanguage(false)}
            className="absolute inset-0 bg-mystic-ink/40 backdrop-blur-sm"
          />
          <div className="animate-toast-in relative w-full max-w-xs rounded-bubble-lg bg-white p-6 shadow-pastel-lg">
            <h3 className="flex items-center gap-2 font-extrabold text-mystic-ink-deep">
              <Icon name="globe" className="h-5 w-5 text-mystic-purple" />
              {t.settings.chooseLanguage}
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {(Object.keys(languageNames) as Language[]).map((lang) => {
                const active = lang === language;
                return (
                  <li key={lang}>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage(lang);
                        setShowLanguage(false);
                        showToast(
                          t.settings.languageChangedToast.replace(
                            "{lang}",
                            languageNames[lang],
                          ),
                        );
                      }}
                      aria-pressed={active}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 font-semibold transition-colors ${
                        active
                          ? "border-mystic-purple bg-mystic-lavender/60 text-mystic-purple"
                          : "border-mystic-border text-mystic-ink/75 hover:bg-mystic-lavender/40"
                      }`}
                    >
                      {languageNames[lang]}
                      {active && <span aria-hidden="true">✓</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => setShowLanguage(false)}
              className="mt-4 w-full rounded-full border border-mystic-border py-2.5 text-sm font-semibold text-mystic-ink/70 transition-colors hover:bg-mystic-pink-light"
            >
              {t.settings.close}
            </button>
          </div>
        </div>
      )}

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
              {t.settings.logoutConfirmBody1.replace(
                "น้องดาว",
                profile?.display_name ?? "น้องดาว",
              )}
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
