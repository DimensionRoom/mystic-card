import { useParams } from "react-router";
import CheckoutPage from "../components/shop/CheckoutPage";
import { getProduct } from "../data/shopProducts";
import { useAppNavigate } from "../router/useAppNavigate";

export default function CheckoutRoute() {
  const { productId } = useParams<{ productId?: string }>();
  const navigate = useAppNavigate();
  const product = productId ? getProduct(productId) : undefined;
  return <CheckoutPage product={product} onNavigate={navigate} />;
}
