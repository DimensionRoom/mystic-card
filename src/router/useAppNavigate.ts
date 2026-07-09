import { useNavigate } from "react-router";
import { isImplementedPath } from "./paths";
import { useToast } from "./ToastContext";

// drop-in แทน prop onNavigate เดิม: path จริง → navigate จริง, path ที่ยังไม่ implement → toast
export function useAppNavigate(): (path: string) => void {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return (path: string) => {
    if (isImplementedPath(path)) {
      navigate(path);
      return;
    }
    showToast(`กำลังพาไปที่ ${path} ✨`);
  };
}
