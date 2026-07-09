import SettingsPage from "../components/settings/SettingsPage";
import { useAppNavigate } from "../router/useAppNavigate";

export default function SettingsRoute() {
  const navigate = useAppNavigate();
  return <SettingsPage onNavigate={navigate} />;
}
