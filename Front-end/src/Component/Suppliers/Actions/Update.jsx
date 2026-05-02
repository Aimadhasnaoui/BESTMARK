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
import TextField from "@mui/material/TextField";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { UpdateSupplier } from "@/Servises/Suppliers";
import { GetCategorys } from "@/Servises/ProductCategories";
import { toast } from "sonner";
import Autocomplete from "@mui/material/Autocomplete";

export default function Update({ isUpdating, setIsUpdating, selectedSupplier }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: GetCategorys,
  });

  useEffect(() => {
    if (selectedSupplier) {
      reset({
        name: selectedSupplier.name,
        company: selectedSupplier.company,
        email: selectedSupplier.email,
        phone: selectedSupplier.phone,
        address: selectedSupplier.address,
        productTypes: selectedSupplier.productTypes?.map(pt => pt._id || pt) || [],
      });
    }
  }, [selectedSupplier, reset]);

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data) => UpdateSupplier(selectedSupplier._id, data),
    onSuccess: () => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Le fournisseur a été mis à jour avec succès");
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
          title="Modifier le fournisseur"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle="Échec de la mise à jour"
          type="Update"
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
                    {...register("phone")}
                  />
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
