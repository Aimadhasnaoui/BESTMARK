import { DataTable } from "@/Component/UI/TablesUi/DataTable";
import { useMemo, useState, useEffect } from "react";
import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import { ActionButtons } from "@/Component/UI/TablesUi/ActionButtons";
import Delete from "./Actions/Delet";
import { GetCategorys } from "@/Servises/ProductCategories";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
export default function ProductType() {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: GetCategorys,
    retry: 2, // ✅ Retry failed requests twice
    refetchOnWindowFocus: false, // ✅ Don't refetch just because user switched tabs
  });
  // ✅ React to errors locally
  useEffect(() => {
    if (isError) {
      toast.error(error?.message ?? "Une erreur s'est produite");
    }
  }, [isError, error]);

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "slug",
        accessorKey: "slug",
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
        data={data?.categories}
        columns={columns}
        ButtonText="Ajouter Product Type"
        TableTitle="Product Types"
        isAjouter={true}
        onButtonClick={() => setIsAdding(true)}
        isLoading={isLoading}
        isError={isError}
        ErrorMessage={error?.message || "Error Occured while fetching data"}
      />

      {/*actions models*/}
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
