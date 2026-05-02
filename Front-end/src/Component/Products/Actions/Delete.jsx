import React from "react";
import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteProduct } from "@/Servises/Products";
import { toast } from "sonner";
import DeletModel from "@/Component/UI/Models/DeletModel";
export default function Delete({ isDeleting, setIsDeleting, selectedProduct }) {
  const queryClient = useQueryClient();

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: () => DeleteProduct(selectedProduct._id),
    onSuccess: () => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Le produit a été supprimé avec succès");
    },
  });

  const  handelDelet = () => {
      mutate(selectedProduct._id);
  }
  return (
    <div>
      {isDeleting && (
        <DeletModel
          open={isDeleting}
          setIsOpen={setIsDeleting}
          title="Supprimer le produit"
          handelDelet={handelDelet}
          itemName={selectedProduct?.name}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle='Échec de la suppression des données'
        >
        </DeletModel>
      )}
    </div>
  );
}
