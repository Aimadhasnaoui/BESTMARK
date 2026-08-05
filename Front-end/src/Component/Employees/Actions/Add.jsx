import React, { useState } from "react";
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
import { AddEmployee } from "@/Servises/Employees";
import { GetEmployeeTypes } from "@/Servises/EmployeeTypes";
import { toast } from "react-hot-toast";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

const PHONE_PATTERN = {
  value: /^0[67][0-9]{8}$/,
  message: "Le numéro doit commencer par 06 ou 07 et contenir 10 chiffres",
};

export default function Add({ isAdding, setIsAdding }) {
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
      salary: 0,
    },
  });

  const { data: typesData } = useQuery({
    queryKey: ["employee-types"],
    queryFn: GetEmployeeTypes,
  });

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: AddEmployee,
    onSuccess: () => {
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("L'employé a été ajouté avec succès");
      reset();
      setImagePreview(null);
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image") {
        if (value?.[0]) formData.append("image", value[0]);
      } else {
        formData.append(key, value);
      }
    });
    mutate(formData);
  };

  return (
    <ActionsModel
      open={isAdding}
      setIsOpen={setIsAdding}
      title="Ajouter un employé"
      handleSubmit={handleSubmit(onSubmit)}
      isPending={isPending}
      isError={isError}
      error={error}
      errorTitle="Échec de l'ajout"
      type="Add"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FieldSet>
          
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field className="md:col-span-2 flex flex-row items-center gap-4">
              <Avatar size="lg">
                {imagePreview ? (
                  <AvatarImage src={imagePreview} alt="Aperçu" />
                ) : (
                  <AvatarFallback>
                    <User className="w-5 h-5 text-slate-400" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <FieldLabel htmlFor="image">Photo</FieldLabel>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  {...register("image", { onChange: handleImageChange })}
                />
              </div>
            </Field>
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
                {...register("email", { 
                    pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Email invalide"
                    }
                })}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
              <TextField
                id="phone"
                fullWidth
                placeholder="06..."
                {...register("phone", {
                  required: "Le téléphone est requis",
                  pattern: PHONE_PATTERN,
                })}
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
              <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
              <TextField
                id="password"
                type="password"
                fullWidth
                {...register("password", { 
                    required: "Le mot de passe est requis",
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
