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
import { AddStockMovement } from "@/Servises/StockMovements";
import { GetProducts } from "@/Servises/Products";
import { toast } from "sonner";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Package, ArrowRightLeft, ClipboardList, FileText } from "lucide-react";

export default function Add({ isAdding, setIsAdding }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "adjustment",
      quantity: 0,
      referenceModel: "Purchase", // Default required by schema
      note: "",
    },
  });

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: GetProducts,
  });

  const selectedProductId = watch("product");
  const selectedProduct = productsData?.products?.find(p => p._id === selectedProductId);

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: AddStockMovement,
    onSuccess: () => {
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["stockMovements"] });
      toast.success("Le mouvement de stock a été ajouté avec succès");
      reset();
    },
  });

  const onSubmit = (data) => {
    // If backend doesn't calculate these, we need to provide them.
    // For now, we'll try to provide them based on current product quantity.
    const currentQty = selectedProduct?.quantity || 0;
    const formattedData = {
      ...data,
      quantityBefore: currentQty,
      quantityAfter: currentQty + Number(data.quantity),
      // createdBy should be handled by the backend (auth middleware)
    };
    mutate(formattedData);
  };

  return (
    <div>
      {isAdding && (
        <ActionsModel
          open={isAdding}
          setIsOpen={setIsAdding}
          title="Nouveau Mouvement de Stock"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle="Échec de l'ajout"
          size="md"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FieldSet>
              <FieldGroup className="grid grid-cols-1 gap-4">
                <Field>
                  <FieldLabel htmlFor="product" className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    Produit
                  </FieldLabel>
                  <Controller
                    name="product"
                    control={control}
                    rules={{ required: "Le produit est requis" }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <>
                        <Autocomplete
                          options={productsData?.products || []}
                          getOptionLabel={(option) => `${option.name} (${option.quantity} en stock)` || ""}
                          isOptionEqualToValue={(option, val) => option._id === val || option._id === val?._id}
                          value={productsData?.products?.find((p) => p._id === value) || null}
                          onChange={(_, newValue) => onChange(newValue ? newValue._id : "")}
                          renderInput={(params) => <TextField {...params} size="small" placeholder="Rechercher un produit..." />}
                        />
                        {error && <FieldError>{error.message}</FieldError>}
                      </>
                    )}
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="type" className="flex items-center gap-2">
                      <ArrowRightLeft className="w-4 h-4 text-purple-600" />
                      Type de mouvement
                    </FieldLabel>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          options={[
                            { label: "Achat", value: "purchase" },
                            { label: "Vente", value: "sale" },
                            { label: "Retour", value: "return" },
                            { label: "Ajustement", value: "adjustment" },
                          ]}
                          getOptionLabel={(option) => option.label}
                          value={[
                            { label: "Achat", value: "purchase" },
                            { label: "Vente", value: "sale" },
                            { label: "Retour", value: "return" },
                            { label: "Ajustement", value: "adjustment" },
                          ].find(o => o.value === field.value)}
                          onChange={(_, newValue) => field.onChange(newValue?.value)}
                          renderInput={(params) => <TextField {...params} size="small" />}
                        />
                      )}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="quantity" className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-emerald-600" />
                      Quantité (mouvement)
                    </FieldLabel>
                    <TextField
                      id="quantity"
                      type="number"
                      size="small"
                      {...register("quantity", {
                        required: "La quantité est requise",
                        validate: (val) => val !== 0 || "La quantité ne peut pas être 0"
                      })}
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Positive pour ENTRÉE, Négative pour SORTIE</p>
                    {errors.quantity && <FieldError>{errors.quantity.message}</FieldError>}
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="referenceModel">Modèle de Référence (Requis par le système)</FieldLabel>
                   <Controller
                      name="referenceModel"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          options={["Purchase", "Sale"]}
                          value={field.value}
                          onChange={(_, newValue) => field.onChange(newValue)}
                          renderInput={(params) => <TextField {...params} size="small" />}
                        />
                      )}
                    />
                </Field>

                <Field>
                  <FieldLabel htmlFor="note" className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-600" />
                    Note / Raison
                  </FieldLabel>
                  <TextField
                    id="note"
                    multiline
                    rows={2}
                    placeholder="Ex: Correction d'inventaire, Produit endommagé..."
                    {...register("note")}
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
