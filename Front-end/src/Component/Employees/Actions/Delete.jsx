import React from "react";
import DeletModel  from "@/Component/Ui/Models/DeletModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteEmployee } from "@/Servises/Employees";
import { toast } from "react-hot-toast";

export default function Delete({ isDeleting, setIsDeleting, selectedEmployee }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => DeleteEmployee(selectedEmployee._id),
    onSuccess: () => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("L'employé a été supprimé avec succès");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Une erreur est survenue lors de la suppression");
    }
  });

  return (
    <DeletModel
      open={isDeleting}
      setIsOpen={setIsDeleting}
      title="Supprimer l'employé"
      description={`Êtes-vous sûr de vouloir supprimer l'employé "${selectedEmployee?.name}" ? Cette action est irréversible.`}
      handleSubmit={mutate}
      isPending={isPending}
    />
  );
}
