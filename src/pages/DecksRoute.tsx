import OwnedDecksPage from "../components/decks/OwnedDecksPage";
import { useAppNavigate } from "../router/useAppNavigate";

export default function DecksRoute() {
  const navigate = useAppNavigate();
  return <OwnedDecksPage onNavigate={navigate} />;
}
