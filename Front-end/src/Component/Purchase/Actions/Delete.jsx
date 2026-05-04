import React from "react";
import DeletModel from "@/Component/Ui/Models/DeletModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeletePurchase } from "@/Servises/Purchases";
import { toast } from "sonner";

export default function Delete({ isDeleting, setIsDeleting, selectedPurchase }) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => DeletePurchase(selectedPurchase._id),
    onSuccess: () => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      toast.success("Achat supprimé avec succès");
    },
  });

  return (
    <DeletModel
      open={isDeleting}
      setIsOpen={setIsDeleting}
      handelDelet={mutate}
      isPending={isPending}
      isError={isError}
      error={error}
      title="Supprimer l'achat ?"
      itemName={selectedPurchase ? `Achat ${selectedPurchase.code}` : ""}
      DeleteMsg="Voulez-vous vraiment supprimer cet enregistrement d'achat ?"
    />
  );
}
