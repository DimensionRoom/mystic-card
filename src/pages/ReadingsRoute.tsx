import MyReadingsPage from "../components/my-readings/MyReadingsPage";
import { useAppNavigate } from "../router/useAppNavigate";

export default function ReadingsRoute() {
  const navigate = useAppNavigate();
  return <MyReadingsPage onNavigate={navigate} />;
}
