import React from "react";
import DeletModel from "@/Component/Ui/Models/DeletModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteTransaction } from "@/Servises/Transactions";
import { toast } from "sonner";

export default function Delete({ isDeleting, setIsDeleting, selectedTransaction }) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => DeleteTransaction(selectedTransaction._id),
    onSuccess: () => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("La transaction a été supprimée avec succès");
    },
  });

  return (
    <DeletModel
      open={isDeleting}
      setIsOpen={setIsDeleting}
      handelDelet={mutate}
      isPending={isPending}
      itemName={`Transaction du ${new Date(selectedTransaction?.date).toLocaleDateString()}`}
      title="Supprimer la transaction ?"
      DeleteMsg={`Êtes-vous sûr de vouloir supprimer cette transaction d'un montant de ${selectedTransaction?.amount} MAD ? Cette action est irréversible.`}
      isError={isError}
      error={error}
    />
  );
}
