import React from "react";
import DeletModel from "@/Component/Ui/Models/DeletModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteDelivery } from "@/Servises/Delivery";
import { toast } from "sonner";

export default function Delete({ isDeleting, setIsDeleting, selectedDelivery }) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => DeleteDelivery(selectedDelivery._id),
    onSuccess: () => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      toast.success("Livraison supprimée avec succès");
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
      title="Supprimer la livraison ?"
      itemName={selectedDelivery ? `Livraison ${selectedDelivery.sale?.invoiceNumber}` : ""}
      DeleteMsg="Voulez-vous vraiment supprimer cet enregistrement de livraison ?"
    />
  );
}
