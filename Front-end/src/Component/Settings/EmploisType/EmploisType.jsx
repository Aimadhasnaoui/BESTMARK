import { DataTable } from "@/Component/UI/TablesUi/DataTable";
import { useMemo, useState } from "react";
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import { ActionButtons } from "@/Component/UI/TablesUi/ActionButtons";
import Delete from "./Actions/Delete";
import { GetEmployeeTypes } from "@/Servises/EmployeeTypes";
import { useQuery } from "@tanstack/react-query";
import { useModelPermissions } from "@/hooks/usePermissions";

export default function EmploisType() {
  const { canAdd, canEdit, canDelete } = useModelPermissions("Types d'employés");
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employee-types"],
    queryFn: GetEmployeeTypes,
    retry: 2, // ✅ Retry failed requests twice
    refetchOnWindowFocus: false, // ✅ Don't refetch just because user switched tabs
  });

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Permission",
        accessorKey: "permissions",
        cell: ({ row }) => (
          <div className="flex flex-col gap-1.5">
            {row.original.permissions?.length ? (
              row.original.permissions.map((perm) => (
                <div
                  key={perm.model}
                  className="flex flex-wrap items-center gap-1.5"
                >
                  <span className="text-xs font-semibold text-slate-700">
                    {perm.model}:
                  </span>
                  {perm.actions?.length ? (
                    perm.actions.map((action) => (
                      <span
                        key={action}
                        className="inline-flex items-center rounded-md bg-[#0050CB]/10 px-2 py-0.5 text-[11px] font-medium text-[#0050CB] ring-1 ring-inset ring-[#0050CB]/20"
                      >
                        {action}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] italic text-slate-400">
                      Aucune
                    </span>
                  )}
                </div>
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
                    setSelectedType(row.original);
                    setIsUpdating(true);
                  }
                : undefined
            }
            onDelete={
              canDelete
                ? () => {
                    setSelectedType(row.original);
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
      <DataTable
        data={data?.employeeTypes}
        columns={columns}
        ButtonText="Ajouter Type d'Emploi"
        TableTitle="Types d'Emplois"
        isAjouter={canAdd}
        onButtonClick={() => setIsAdding(true)}
        isLoading={isLoading}
        isError={isError}
        ErrorMessage={error?.message || "Error occurred while fetching data"}
      />

      {/* Actions Modals */}
      <Add isAdding={isAdding} setIsAdding={setIsAdding} />
      <Update
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        selectedType={selectedType}
      />
      <Delete
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
        selectedType={selectedType}
      />
    </div>
  );
}
