import React from 'react'
import  DeletModel  from '@/Component/Ui/Models/DeletModel'
import {useMutation,useQueryClient} from "@tanstack/react-query"
import {DeleteCategory} from "@/Servises/ProductCategories"

export default function Delet({isDeleting,setIsDeleting,selectedType}) {
    const queryClient = useQueryClient();
    const {mutate,isPending} = useMutation({
        mutationFn: DeleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setIsDeleting(false);
        },
    })
    const handleSubmitDelete = () => {
        mutate(selectedType.id);
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
        />
      )}
    </div>
  )
}
