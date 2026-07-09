import CheckoutPage from "../components/shop/CheckoutPage";
import { useAppNavigate } from "../router/useAppNavigate";

export default function CheckoutRoute() {
  const navigate = useAppNavigate();
  return <CheckoutPage onNavigate={navigate} />;
}
