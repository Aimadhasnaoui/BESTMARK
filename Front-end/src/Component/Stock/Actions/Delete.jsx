import React, { useEffect } from "react";
import DeletModel from "@/Component/Ui/Models/DeletModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteStockMovement } from "@/Servises/StockMovements";
import { toast } from "sonner";

export default function Delete({ isDeleting, setIsDeleting, selectedMovement }) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => DeleteStockMovement(selectedMovement._id),
    onSuccess: () => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ["stockMovements"] });
      toast.success("Le mouvement de stock a été supprimé avec succès");
    },
  });

  useEffect(()=>{
    if(isError){
      console.log("Full Error:", error)
      console.log("Server Message:", error?.response?.data?.message)
    }
  },[isError])

  return (
    <DeletModel
      open={isDeleting}
      setIsOpen={setIsDeleting}
      handelDelet={mutate}
      isPending={isPending}
      isError={isError}
      // error={error}
      errorMessage={error?.response?.data?.message}
      title="Supprimer le mouvement ?"
      itemName={selectedMovement ? `Mouvement de ${selectedMovement.product?.name}` : ""}
      DeleteMsg="Voulez-vous vraiment supprimer cet enregistrement de mouvement ? Attention, cela ne modifiera pas automatiquement le stock actuel du produit."
    />
  );
}
