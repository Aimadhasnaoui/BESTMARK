import { useContext } from "react";
import { DataContext } from "@/Component/Data/contextApi";
import { hasModelAccess, hasAnyModelAccess, hasAction } from "@/lib/permissions";

export function usePermissions() {
  const { permissions } = useContext(DataContext);
  return { permissions };
}

export function useAnyModelAccess(models) {
  const { permissions } = useContext(DataContext);
  return hasAnyModelAccess(permissions, models);
}

export function useModelPermissions(model) {
  const { permissions } = useContext(DataContext);
  return {
    canView: hasModelAccess(permissions, model),
    canAdd: hasAction(permissions, model, "Ajouter"),
    canEdit: hasAction(permissions, model, "Modifier"),
    canDelete: hasAction(permissions, model, "Supprimer"),
  };
}
