import { useModelPermissions, useAnyModelAccess } from "@/hooks/usePermissions";
import NoAccesPage from "@/Component/ErrorPage/NoAccesPage";

export default function RequirePermission({ model, models, children }) {
  const { canView: canViewOne } = useModelPermissions(model);
  const canViewAny = useAnyModelAccess(models);
  const canView = models ? canViewAny : canViewOne;
  if (!canView) {
    return <NoAccesPage />;
  }
  return children;
}
