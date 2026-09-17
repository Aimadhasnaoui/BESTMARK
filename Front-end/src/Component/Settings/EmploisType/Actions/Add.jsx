import React from "react";
import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddEmployeeType } from "@/Servises/EmployeeTypes";
import { toast } from "react-hot-toast";
import PermissionsAssigner from "./PermissionsAssigner";

export default function Add({ isAdding, setIsAdding }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", permissions: [] } });
  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: AddEmployeeType,
    onSuccess: () => {
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["employee-types"] });
      toast.success("Employee type has been added successfully");
      reset({ name: "", permissions: [] });
    },
  });
  const onSubmit = (data) => {
    mutate(data);
  };
  return (
    <div>
      {isAdding && (
        <ActionsModel
          open={isAdding}
          setIsOpen={setIsAdding}
          title="Add Employee Type"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle="Échec de l'ajout des données"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <TextField
                    id="name"
                    autoComplete="off"
                    placeholder="Employee Type Name"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
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
                      <PermissionsAssigner value={value} onChange={onChange} />
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
