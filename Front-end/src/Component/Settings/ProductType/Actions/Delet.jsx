import React from 'react'
import  DeletModel  from '@/Component/Ui/Models/DeletModel'
import {useMutation,useQueryClient} from "@tanstack/react-query"
import {DeleteCategory} from "@/Servises/ProductCategories"
import { toast } from "sonner";
export default function Delet({isDeleting,setIsDeleting,selectedType}) {
    const queryClient = useQueryClient();
    const {mutate,isPending,isError,error} = useMutation({
        mutationFn: DeleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setIsDeleting(false);
            toast.success("Produit supprimé avec succès");
        },
    })
    const handleSubmitDelete = () => {
        mutate(selectedType._id);
    };
  return (
    <div>
        {isDeleting && (
        <DeletModel
          open={isDeleting}
          setIsOpen={setIsDeleting}
          title="Supprimer le type de produit"
          itemName={selectedType?.name}
          handelDelet={handleSubmitDelete}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle='Échec de la suppression des données'
          errorMessage={error?.response?.data?.message}
        />
      )}
    </div>
  )
}
