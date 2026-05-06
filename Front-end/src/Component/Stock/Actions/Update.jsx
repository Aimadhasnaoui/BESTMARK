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
import { UpdateStockMovement } from "@/Servises/StockMovements";
import { GetProducts } from "@/Servises/Products";
import { toast } from "sonner";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Package, ArrowRightLeft, ClipboardList, FileText } from "lucide-react";

export default function Update({ isUpdating, setIsUpdating, selectedMovement }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: GetProducts,
  });

  useEffect(() => {
    if (selectedMovement) {
      console.log("selectedMovement", selectedMovement);
      reset({
        product: selectedMovement.product?._id || selectedMovement.product,
        type: selectedMovement.type,
        quantity: selectedMovement.quantity,
        referenceModel: selectedMovement.referenceModel,
        note: selectedMovement.note || "",
        quantityBefore: selectedMovement.quantityBefore,
        quantityAfter: selectedMovement.quantityAfter,
      });
    }
  }, [selectedMovement, reset]);

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data) => UpdateStockMovement(selectedMovement._id, data),
    onSuccess: () => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["stockMovements"] });
      toast.success("Le mouvement de stock a été modifié avec succès");
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
          title="Modifier le Mouvement"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle="Échec de la modification"
          size="md"
          type="Update"
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
                          getOptionLabel={(option) => option.name || ""}
                          isOptionEqualToValue={(option, val) => option._id === val || option._id === (val?._id || val)}
                          value={productsData?.products?.find((p) => p._id === (value?._id || value)) || null}
                          onChange={(_, newValue) => onChange(newValue ? newValue._id : "")}
                          renderInput={(params) => <TextField {...params} size="small" />}
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
                      Type
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
                      Quantité
                    </FieldLabel>
                    <TextField
                      id="quantity"
                      type="number"
                      size="small"
                      {...register("quantity", { required: "Requis" })}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="quantityBefore" className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-emerald-600" />
                      Quantité avant
                    </FieldLabel>
                    <TextField
                      id="quantityBefore"
                      type="number"
                      size="small"
                      {...register("quantityBefore", { required: "Requis" })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="quantityAfter" className="flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-emerald-600" />
                      Quantité après
                    </FieldLabel>
                    <TextField
                      id="quantityAfter"
                      type="number"
                      size="small"
                      {...register("quantityAfter", { required: "Requis" })}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="note" className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-600" />
                    Note
                  </FieldLabel>
                  <TextField
                    id="note"
                    multiline
                    rows={2}
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
