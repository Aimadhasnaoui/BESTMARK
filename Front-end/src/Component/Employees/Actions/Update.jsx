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
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { UpdateEmployee } from "@/Servises/Employees";
import { GetEmployeeTypes } from "@/Servises/EmployeeTypes";
import { toast } from "sonner";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function Update({ isUpdating, setIsUpdating, selectedEmployee }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const { data: typesData } = useQuery({
    queryKey: ["employee-types"],
    queryFn: GetEmployeeTypes,
  });

  useEffect(() => {
    if (selectedEmployee) {
      reset({
        name: selectedEmployee.name,
        email: selectedEmployee.email,
        phone: selectedEmployee.phone,
        address: selectedEmployee.address,
        mission: selectedEmployee.mission?._id || selectedEmployee.mission,
        salary: selectedEmployee.salary,
        isActive: selectedEmployee.isActive,
      });
    }
  }, [selectedEmployee, reset]);

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data) => UpdateEmployee(selectedEmployee._id, data),
    onSuccess: () => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Les informations de l'employé ont été mises à jour");
    },
  });

  const onSubmit = (data) => {
    // On update, we usually don't send the password unless it's being changed
    if (!data.password) delete data.password;
    mutate(data);
  };

  return (
    <ActionsModel
      open={isUpdating}
      setIsOpen={setIsUpdating}
      title="Modifier l'employé"
      handleSubmit={handleSubmit(onSubmit)}
      isPending={isPending}
      isError={isError}
      error={error}
      errorTitle="Échec de la modification"
      type="Update"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FieldSet>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field className="md:col-span-2">
              <FieldLabel htmlFor="name">Nom complet</FieldLabel>
              <TextField
                id="name"
                fullWidth
                placeholder="Ex: Ahmed Benani"
                {...register("name", { required: "Le nom est requis" })}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <TextField
                id="email"
                type="email"
                fullWidth
                placeholder="ahmed@example.com"
                {...register("email")}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
              <TextField
                id="phone"
                fullWidth
                placeholder="06..."
                {...register("phone", { required: "Le téléphone est requis" })}
              />
              {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
            </Field>

            <Field className="md:col-span-2">
              <FieldLabel htmlFor="address">Adresse</FieldLabel>
              <TextField
                id="address"
                fullWidth
                multiline
                rows={2}
                placeholder="Adresse de l'employé..."
                {...register("address")}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="mission">Mission (Type d'emploi)</FieldLabel>
              <Controller
                name="mission"
                control={control}
                rules={{ required: "La mission est requise" }}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    options={typesData?.employeeTypes || []}
                    getOptionLabel={(option) => option.name || ""}
                    isOptionEqualToValue={(option, val) => option._id === val}
                    value={typesData?.employeeTypes?.find((t) => t._id === value) || null}
                    onChange={(_, newValue) => onChange(newValue?._id || "")}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Sélectionner une mission" />
                    )}
                  />
                )}
              />
              {errors.mission && <FieldError>{errors.mission.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="salary">Salaire (DH)</FieldLabel>
              <TextField
                id="salary"
                type="number"
                fullWidth
                {...register("salary", { 
                    required: "Le salaire est requis",
                    min: { value: 0, message: "Le salaire doit être positif" }
                })}
              />
              {errors.salary && <FieldError>{errors.salary.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Mot de passe (Laisser vide pour ne pas changer)</FieldLabel>
              <TextField
                id="password"
                type="password"
                fullWidth
                {...register("password", { 
                    minLength: { value: 8, message: "Minimum 8 caractères" }
                })}
              />
              {errors.password && <FieldError>{errors.password.message}</FieldError>}
            </Field>

            <Field className="flex flex-row items-center gap-2 mt-4">
              <input
                id="isActive"
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                {...register("isActive")}
              />
              <FieldLabel htmlFor="isActive" className="mb-0">Compte actif</FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </ActionsModel>
  );
}
