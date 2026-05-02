import { DataTable } from "@/Component/UI/TablesUi/DataTable";
import { useMemo, useState } from "react";
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import { ActionButtons } from "@/Component/UI/TablesUi/ActionButtons";
import Delete from "./Actions/Delete";
import { GetEmployeeTypes } from "@/Servises/EmployeeTypes";
import { useQuery } from "@tanstack/react-query";

export default function EmploisType() {
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
        header: "Actions",
        accessorKey: "actions",
        className: "sticky right-0 bg-white border-l w-[150px] bg-[#F8FAFC]",
        cell: ({ row }) => (
          <ActionButtons
            onEdit={() => {
              setSelectedType(row.original);
              setIsUpdating(true);
            }}
            onDelete={() => {
              setSelectedType(row.original);
              setIsDeleting(true);
            }}
          />
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <DataTable
        data={data?.employeeTypes}
        columns={columns}
        ButtonText="Ajouter Type d'Emploi"
        TableTitle="Types d'Emplois"
        isAjouter={true}
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
