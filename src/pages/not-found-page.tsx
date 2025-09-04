import { useNavigate } from "react-router-dom";
import NotFound from "@/components/pages/not-found-content";

export function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/home");
  }

  return <NotFound onGoHome={handleGoHome} />
}