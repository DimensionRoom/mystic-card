import ShopPage from "../components/shop/ShopPage";
import { useAppNavigate } from "../router/useAppNavigate";

export default function ShopRoute() {
  const navigate = useAppNavigate();
  return <ShopPage onNavigate={navigate} />;
}
