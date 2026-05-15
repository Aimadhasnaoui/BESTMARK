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
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AddCustomer } from "@/Servises/Customers";
import { GetProducts } from "@/Servises/Products";
import { toast } from "react-hot-toast";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

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
      quantity: 1,
      status: "pending",
      notes: "",
    },
  });

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: GetProducts,
  });

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: AddCustomer,
    onSuccess: () => {
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("La demande client a été ajoutée avec succès");
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
          title="Ajouter une demande client"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle="Échec de l'ajout"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 hide-scrollbar overflow-y-auto px-1"
          >
            <FieldSet>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="customerName">Nom du client</FieldLabel>
                  <TextField
                    id="customerName"
                    placeholder="Ex: Ahmed Benani"
                    fullWidth
                    {...register("customerName", { required: "Le nom est requis" })}
                  />
                  {errors.customerName && (
                    <FieldError>{errors.customerName.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="customerPhone">Téléphone</FieldLabel>
                  <TextField
                    id="customerPhone"
                    placeholder="Ex: 0612345678"
                    fullWidth
                    {...register("customerPhone", { required: "Le téléphone est requis" })}
                  />
                  {errors.customerPhone && (
                    <FieldError>{errors.customerPhone.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="product">Produit</FieldLabel>
                  <Controller
                    name="product"
                    control={control}
                    rules={{ required: "Le produit est requis" }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        disablePortal
                        options={productsData?.products || []}
                        getOptionLabel={(option) => option.name || ""}
                        isOptionEqualToValue={(option, val) => 
                          typeof val === 'string' ? option._id === val : option._id === val?._id
                        }
                        value={productsData?.products?.find((p) => p._id === value) || null}
                        onChange={(_, newValue) => {
                          onChange(newValue ? newValue._id : "");
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                  {errors.product && (
                    <FieldError>{errors.product.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="quantity">Quantité</FieldLabel>
                  <TextField
                    id="quantity"
                    type="number"
                    fullWidth
                    {...register("quantity", {
                      required: "La quantité est requise",
                      min: { value: 1, message: "La quantité doit être au moins 1" },
                    })}
                  />
                  {errors.quantity && (
                    <FieldError>{errors.quantity.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="status">Statut</FieldLabel>
                  <TextField
                    id="status"
                    select
                    fullWidth
                    {...register("status", { required: "Le statut est requis" })}
                    defaultValue="pending"
                  >
                    <MenuItem value="pending">En attente</MenuItem>
                    <MenuItem value="notified">Notifié</MenuItem>
                    <MenuItem value="fulfilled">Terminé</MenuItem>
                    <MenuItem value="cancelled">Annulé</MenuItem>
                  </TextField>
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="notes">Notes</FieldLabel>
                  <TextField
                    id="notes"
                    multiline
                    rows={3}
                    placeholder="Notes supplémentaires..."
                    fullWidth
                    {...register("notes")}
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
