import { useNavigate, useParams } from "react-router";
import DeckReadingPage from "../components/DeckReadingPage";
import type { DeckTab } from "../components/DeckTabs";
import { getDeck } from "../data/decks";
import { useAppNavigate } from "../router/useAppNavigate";
import NotFoundPage from "./NotFoundPage";

const validTabs: DeckTab[] = ["read", "meaning", "about"];

export default function DeckRoute() {
  const { deckId, tab } = useParams<{ deckId: string; tab?: string }>();
  const navigate = useAppNavigate();
  const routerNavigate = useNavigate();
  const deck = deckId ? getDeck(deckId) : undefined;

  if (!deck) return <NotFoundPage />;
  // /deck/:deckId/banana ฯลฯ — แท็บที่ไม่รู้จัก ถือเป็น 404
  if (tab && !validTabs.includes(tab as DeckTab)) return <NotFoundPage />;

  const activeTab: DeckTab = (tab as DeckTab | undefined) ?? "read";

  // สลับแท็บ = แก้ URL ตรง ๆ (canonical "read" ไม่มี /read ต่อท้าย); ไม่ผ่าน
  // useAppNavigate เพราะ path นี้ valid เสมอ ไม่ต้องเช็ค isImplementedPath
  const handleTabChange = (nextTab: DeckTab) => {
    routerNavigate(
      nextTab === "read" ? `/deck/${deck.id}` : `/deck/${deck.id}/${nextTab}`,
    );
  };

  return (
    <DeckReadingPage
      key={deck.id}
      deck={deck}
      onNavigate={navigate}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />
  );
}
