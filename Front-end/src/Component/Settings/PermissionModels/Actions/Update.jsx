import React, { useEffect } from "react";
import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdatePermissionModel } from "@/Servises/PermissionModels";
import { toast } from "react-hot-toast";
import PermissionsPicker from "./PermissionsPicker";
import ModelNameSelect from "./ModelNameSelect";

export default function Update({ isUpdating, setIsUpdating, selectedModel }) {
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", permissions: [] } });

  useEffect(() => {
    if (selectedModel) {
      reset({
        name: selectedModel.name,
        permissions: selectedModel.permissions || [],
      });
    }
  }, [selectedModel, reset]);

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data) => UpdatePermissionModel(selectedModel._id, data),
    onSuccess: () => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["permission-models"] });
      toast.success("Le modèle a été mis à jour avec succès");
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div>
      {isUpdating && (
        <ActionsModel
          open={isUpdating}
          setIsOpen={setIsUpdating}
          title="Modifier le modèle"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle="Échec de la mise à jour"
          type="Update"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nom du modèle</FieldLabel>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Le nom est requis" }}
                    render={({ field: { value, onChange } }) => (
                      <ModelNameSelect
                        value={value}
                        onChange={onChange}
                        error={errors.name}
                      />
                    )}
                  />
                  {errors.name && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Permissions</FieldLabel>
                  <Controller
                    name="permissions"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <PermissionsPicker value={value} onChange={onChange} />
                    )}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </ActionsModel>
      )}
    </div>
  );
}
