import RuneDicePage from "../components/rune-dice/RuneDicePage";
import { useAppNavigate } from "../router/useAppNavigate";

export default function RuneDiceRoute() {
  const navigate = useAppNavigate();
  return <RuneDicePage onNavigate={navigate} />;
}
