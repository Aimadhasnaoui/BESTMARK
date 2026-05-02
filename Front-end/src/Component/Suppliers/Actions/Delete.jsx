import React from "react";
import DeletModel from "@/Component/UI/Models/DeletModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteSupplier } from "@/Servises/Suppliers";
import { toast } from "sonner";

export default function Delete({ isDeleting, setIsDeleting, selectedSupplier }) {
  const queryClient = useQueryClient();

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: () => DeleteSupplier(selectedSupplier._id),
    onSuccess: () => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Le fournisseur a été supprimé avec succès");
    },
  });

  const handelDelet = () => {
    mutate();
  };

  return (
    <div>
      {isDeleting && (
        <DeletModel
          open={isDeleting}
          setIsOpen={setIsDeleting}
          title="Supprimer le fournisseur"
          handelDelet={handelDelet}
          itemName={selectedSupplier?.name}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle="Échec de la suppression"
        />
      )}
    </div>
  );
}
