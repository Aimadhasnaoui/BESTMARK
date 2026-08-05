import React from "react";
import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AddSupplier } from "@/Servises/Suppliers";
import { GetCategorys } from "@/Servises/ProductCategories";
import { toast } from "react-hot-toast";
import Autocomplete from "@mui/material/Autocomplete";

const PHONE_PATTERN = /^0[67][0-9]{8}$/;
const PHONE_MESSAGE = "Le numéro doit commencer par 06 ou 07 et contenir 10 chiffres";

export default function Add({ isAdding, setIsAdding }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productTypes: [],
    }
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: GetCategorys,
  });

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: AddSupplier,
    onSuccess: () => {
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Le fournisseur a été ajouté avec succès");
      reset();
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
          title="Ajouter un fournisseur"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle="Échec de l'ajout"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="name">Nom complet</FieldLabel>
                  <TextField
                    id="name"
                    placeholder="Ex: Jean Dupont"
                    {...register("name", { required: "Le nom est requis" })}
                  />
                  {errors.name && <FieldError>{errors.name.message}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="company">Entreprise</FieldLabel>
                  <TextField
                    id="company"
                    placeholder="Ex: Tech Solutions SARL"
                    {...register("company")}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
                  <TextField
                    id="phone"
                    placeholder="Ex: 06 12 34 56 78"
                    {...register("phone", {
                      validate: (value) =>
                        !value || PHONE_PATTERN.test(value) || PHONE_MESSAGE,
                    })}
                  />
                  {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <TextField
                    id="email"
                    type="email"
                    placeholder="exemple@mail.com"
                    {...register("email", {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Adresse email invalide"
                      }
                    })}
                  />
                  {errors.email && <FieldError>{errors.email.message}</FieldError>}
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="address">Adresse</FieldLabel>
                  <TextField
                    id="address"
                    multiline
                    rows={2}
                    placeholder="Adresse complète..."
                    {...register("address")}
                  />
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel>Types de produits fournis</FieldLabel>
                  <Controller
                    name="productTypes"
                    control={control}
                    rules={{
                      validate: (value) =>
                        (value && value.length > 0) || "Sélectionnez au moins un type de produit",
                    }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        multiple
                        disablePortal
                        options={categoriesData?.categories || []}
                        getOptionLabel={(option) => option.name || ""}
                        isOptionEqualToValue={(option, val) => option._id === val || option._id === val?._id}
                        value={categoriesData?.categories?.filter((cat) => value?.includes(cat._id)) || []}
                        onChange={(_, newValue) => {
                          onChange(newValue.map((v) => v._id));
                        }}
                        renderInput={(params) => <TextField {...params} placeholder="Sélectionner les catégories..." />}
                      />
                    )}
                  />
                  {errors.productTypes && (
                    <FieldError>{errors.productTypes.message}</FieldError>
                  )}
                  <p className="text-[0.8rem] text-muted-foreground mt-2">
                    Sélectionnez les types de produits que ce fournisseur propose.
                  </p>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </ActionsModel>
      )}
    </div>
  );
}
