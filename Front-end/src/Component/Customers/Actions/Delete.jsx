import React from "react";
import DeletModel from "@/Component/Ui/Models/DeletModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteCustomer } from "@/Servises/Customers";
import { toast } from "sonner";

export default function Delete({ isDeleting, setIsDeleting, selectedCustomer }) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => DeleteCustomer(selectedCustomer._id),
    onSuccess: () => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("La demande client a été supprimée avec succès");
    },
  });

  return (
    <DeletModel
      open={isDeleting}
      setIsOpen={setIsDeleting}
      handelDelet={mutate}
      isPending={isPending}
      itemName={selectedCustomer?.customerName}
      title="Supprimer la demande ?"
      DeleteMsg={`Êtes-vous sûr de vouloir supprimer la demande de "${selectedCustomer?.customerName}" ? Cette action est irréversible.`}
      isError={isError}
      error={error}
    />
  );
}
