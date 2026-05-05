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
import { UpdateCustomer } from "@/Servises/Customers";
import { GetProducts } from "@/Servises/Products";
import { toast } from "sonner";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function Update({ isUpdating, setIsUpdating, selectedCustomer }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (selectedCustomer) {
      reset({
        customerName: selectedCustomer.customerName,
        customerPhone: selectedCustomer.customerPhone,
        product: selectedCustomer.product?._id || selectedCustomer.product,
        quantity: selectedCustomer.quantity,
        status: selectedCustomer.status,
        notes: selectedCustomer.notes,
      });
    }
  }, [selectedCustomer, reset]);

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: GetProducts,
  });

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data) => UpdateCustomer(selectedCustomer._id, data),
    onSuccess: () => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("La demande client a été mise à jour avec succès");
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
          title="Modifier la demande client"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          isError={isError}
          error={error}
          type="Update"
          errorTitle="Échec de la modification"
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
                    defaultValue={selectedCustomer?.status || "pending"}
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
