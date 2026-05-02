import React from "react";
import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteEmployeeType } from "@/Servises/EmployeeTypes";
import { toast } from "sonner";

export default function Delete({ isDeleting, setIsDeleting, selectedType }) {
  const queryClient = useQueryClient();

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: () => DeleteEmployeeType(selectedType._id),
    onSuccess: () => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ["employee-types"] });
      toast.success("Employee type has been deleted successfully");
    },
  });

  return (
    <div>
      {isDeleting && (
        <ActionsModel
          open={isDeleting}
          setIsOpen={setIsDeleting}
          title="Delete Employee Type"
          handleSubmit={mutate}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle="Échec de la suppression"
          confirmText="Supprimer"
          cancelText="Annuler"
          variant="destructive"
        >
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Êtes-vous sûr de vouloir supprimer le type d'employé{" "}
              <span className="font-bold text-gray-900">
                "{selectedType?.name}"
              </span>
              ? Cette action est irréversible.
            </p>
          </div>
        </ActionsModel>
      )}
    </div>
  );
}
