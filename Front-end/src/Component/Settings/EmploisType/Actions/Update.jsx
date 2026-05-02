import React, { useEffect } from "react";
import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateEmployeeType } from "@/Servises/EmployeeTypes";
import { toast } from "sonner";

export default function Update({ isUpdating, setIsUpdating, selectedType }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (selectedType) {
      reset({
        name: selectedType.name,
      });
    }
  }, [selectedType, reset]);

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data) => UpdateEmployeeType(selectedType._id, data),
    onSuccess: () => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["employee-types"] });
      toast.success("Employee type has been updated successfully");
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
          title="Update Employee Type"
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
              </FieldGroup>
            </FieldSet>
          </form>
        </ActionsModel>
      )}
    </div>
  );
}
