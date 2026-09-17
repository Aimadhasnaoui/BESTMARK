import React from "react";
import DeletModel from "@/Component/Ui/Models/DeletModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeletePermissionModel } from "@/Servises/PermissionModels";
import { toast } from "react-hot-toast";

export default function Delete({ isDeleting, setIsDeleting, selectedModel }) {
  const queryClient = useQueryClient();

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: () => DeletePermissionModel(selectedModel._id),
    onSuccess: () => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ["permission-models"] });
      toast.success("Le modèle a été supprimé avec succès");
    },
  });

  return (
    <DeletModel
      open={isDeleting}
      setIsOpen={setIsDeleting}
      title="Supprimer le modèle"
      itemName={selectedModel?.name}
      handelDelet={mutate}
      isPending={isPending}
      isError={isError}
      error={error}
      errorTitle="Échec de la suppression"
      errorMessage={error?.response?.data?.message}
    />
  );
}
