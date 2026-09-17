import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useModelPermissions } from "@/hooks/usePermissions";
import { DataContext } from "@/Component/Data/contextApi";
import { TrendingUp } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();
  const { canView } = useModelPermissions("Tableau de bord");
  const { userInfo } = useContext(DataContext);

  useEffect(() => {
    if (canView) {
      navigate("/dashboard", { replace: true });
    }
  }, [canView, navigate]);

  if (canView) return null;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0050CB]/10">
        <TrendingUp className="h-8 w-8 text-[#0050CB]" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">
        Bienvenue, {userInfo?.name || "cher collaborateur"} 👋
      </h1>
      <p className="max-w-md text-sm text-slate-500">
        Un nouveau jour, de nouvelles ventes à conclure. Chaque client servi
        aujourd'hui fait grandir le commerce un peu plus.
      </p>
    </div>
  );
}
