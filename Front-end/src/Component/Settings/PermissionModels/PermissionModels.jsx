import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import HeaderPage from "@/Component/UI/HeaderPage";
import { DataTable } from "@/Component/UI/TablesUi/DataTable";
import { ActionButtons } from "@/Component/UI/TablesUi/ActionButtons";
import { GetPermissionModels } from "@/Servises/PermissionModels";
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import Delete from "./Actions/Delete";
import { useModelPermissions } from "@/hooks/usePermissions";

export default function PermissionModels() {
  const { canAdd, canEdit, canDelete } = useModelPermissions("Modèles & Permissions");
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["permission-models"],
    queryFn: GetPermissionModels,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const columns = useMemo(
    () => [
      {
        header: "Modèle",
        accessorKey: "name",
      },
      {
        header: "Permissions",
        accessorKey: "permissions",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1.5">
            {row.original.permissions?.length ? (
              row.original.permissions.map((permission) => (
                <span
                  key={permission}
                  className="inline-flex items-center rounded-md bg-[#0050CB]/10 px-2.5 py-1 text-xs font-medium text-[#0050CB] ring-1 ring-inset ring-[#0050CB]/20"
                >
                  {permission}
                </span>
              ))
            ) : (
              <span className="text-xs italic text-muted-foreground">
                Aucune permission
              </span>
            )}
          </div>
        ),
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => (
          <ActionButtons
            onEdit={
              canEdit
                ? () => {
                    setSelectedModel(row.original);
                    setIsUpdating(true);
                  }
                : undefined
            }
            onDelete={
              canDelete
                ? () => {
                    setSelectedModel(row.original);
                    setIsDeleting(true);
                  }
                : undefined
            }
          />
        ),
      },
    ],
    [canEdit, canDelete],
  );

  return (
    <div>
      <HeaderPage
        title="Gestion des modèles & permissions"
        description="Définissez les modèles de l'application et les permissions qui leur sont associées"
        isAjouter={canAdd}
        ButtonText="Ajouter Modèle"
        onButtonClick={() => setIsAdding(true)}
      />

      <DataTable
        data={data?.permissionModels || []}
        columns={columns}
        isAjouter={false}
        TableTitle="Modèles"
        isLoading={isLoading}
        isError={isError}
        ErrorMessage={error?.message || "Erreur lors du chargement des données"}
      />

      <Add isAdding={isAdding} setIsAdding={setIsAdding} />
      <Update
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        selectedModel={selectedModel}
      />
      <Delete
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
        selectedModel={selectedModel}
      />
    </div>
  );
}
