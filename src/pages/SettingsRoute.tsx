import { useParams } from "react-router";
import SettingsPage, {
  type SettingsView,
} from "../components/settings/SettingsPage";
import { useAppNavigate } from "../router/useAppNavigate";
import { SETTINGS_SUB_VIEWS, type SettingsSubView } from "../router/settingsViews";
import NotFoundPage from "./NotFoundPage";

export default function SettingsRoute() {
  const { view } = useParams<{ view?: string }>();
  const navigate = useAppNavigate();

  // /settings/banana ฯลฯ — sub-view ที่ไม่รู้จัก ถือเป็น 404
  if (view && !SETTINGS_SUB_VIEWS.includes(view as SettingsSubView)) {
    return <NotFoundPage />;
  }

  const activeView: SettingsView = (view as SettingsSubView | undefined) ?? "main";

  return <SettingsPage view={activeView} onNavigate={navigate} />;
}
