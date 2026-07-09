import { useParams } from "react-router";
import DeckReadingPage from "../components/DeckReadingPage";
import { getDeck } from "../data/decks";
import { useAppNavigate } from "../router/useAppNavigate";
import NotFoundPage from "./NotFoundPage";

export default function DeckRoute() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useAppNavigate();
  const deck = deckId ? getDeck(deckId) : undefined;

  if (!deck) return <NotFoundPage />;

  return <DeckReadingPage key={deck.id} deck={deck} onNavigate={navigate} />;
}
