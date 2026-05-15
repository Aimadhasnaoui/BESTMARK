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
import { GetTransactionsbyref } from "@/Servises/Transactions";
import { GetProducts } from "@/Servises/Products";
import { toast } from "react-hot-toast";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  Package,
  ArrowRightLeft,
  ClipboardList,
  FileText,
  Banknote,
  Info,
} from "lucide-react";

export default function Update({
  isUpdating,
  setIsUpdating,
  selectedMovement,
}) {
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
  const { data: transactionData } = useQuery({
    queryKey: ["transaction"],
    queryFn: () => GetTransactionsbyref(selectedMovement?._id),
  });

  const movementType = watch("type");
  const quantityMovement = watch("quantity");
  const selectedProductId = watch("product");
  const priceMovement = watch("price");
  const selectedProduct = productsData?.products?.find(
    (p) => p._id === selectedProductId,
  );
  useEffect(() => {
    if (selectedMovement) {
      reset({
        product: selectedMovement.product?._id || selectedMovement.product,
        type: selectedMovement.type,
        quantity: selectedMovement.quantity,
        price: transactionData?.transaction?.amount || 0,
        referenceModel: selectedMovement.referenceModel,
        note: selectedMovement.note || "",
      });
    }
  }, [selectedMovement, reset]);

  useEffect(() => {
    if (movementType === "return" && quantityMovement && selectedProduct) {
      const price =
        Number(quantityMovement) * Number(selectedProduct?.sellingPrice);
      setValue("price", price);
      setValue(
        "note",
        `Retour de ${quantityMovement} unités du produit ${selectedProduct?.name} a la date du ${new Date().toLocaleDateString()} est remboursement de ${price} `,
      );
    } else if (movementType == "adjustment") {
      setValue(
        "note",
        `Ajustement le  produit ${selectedProduct?.name} par ${quantityMovement > 0 ? "une augmentation" : "une diminution"} de ${quantityMovement}`,
      );
    } else {
      setValue("price", 0);
      setValue("note", ``);
    }
  }, [movementType, quantityMovement, selectedProduct]);

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: UpdateStockMovement,
    onSuccess: () => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["stockMovements"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Le mouvement a été recalculé et mis à jour avec succès");
    },
  });

  const onSubmit = (data) => {
    const formattedData = {
      price: +data.price,
      quantity: +data.quantity,
      createdBy: selectedMovement.createdBy,
      prodcutQantity:
        selectedMovement.type === "return"
          ? selectedMovement.quantityBefore - Number(data.quantity)
          : selectedMovement.quantityBefore + Number(data.quantity),
      note: data.note,
    };
    mutate({ id: selectedMovement._id, data: formattedData });
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  <span className="font-bold">Instruction :</span> Pour modifier
                  le produit ou le type de mouvement, vous devez supprimer cet
                  enregistrement et en créer un nouveau. Seules la quantité, le
                  prix et la note sont modifiables pour garantir l'intégrité de
                  vos données d'inventaire.
                </p>
              </div>
            </div>
            <FieldSet>
              <FieldGroup className="grid grid-cols-1 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="product"
                    className="flex items-center gap-2"
                  >
                    <Package className="w-4 h-4 text-blue-600" />
                    Produit
                  </FieldLabel>
                  <Controller
                    name="product"
                    control={control}
                    rules={{ required: "Le produit est requis" }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <Autocomplete
                          disabled
                          options={productsData?.products || []}
                          getOptionLabel={(option) => option.name || ""}
                          isOptionEqualToValue={(option, val) =>
                            option._id === val ||
                            option._id === (val?._id || val)
                          }
                          value={
                            productsData?.products?.find(
                              (p) => p._id === (value?._id || value),
                            ) || null
                          }
                          onChange={(_, newValue) =>
                            onChange(newValue ? newValue._id : "")
                          }
                          renderInput={(params) => (
                            <TextField {...params} size="small" />
                          )}
                        />
                        {error && <FieldError>{error.message}</FieldError>}
                      </>
                    )}
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel
                      htmlFor="type"
                      className="flex items-center gap-2"
                    >
                      <ArrowRightLeft className="w-4 h-4 text-purple-600" />
                      Type
                    </FieldLabel>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          disabled
                          options={[
                            { label: "Retour", value: "return" },
                            { label: "Ajustement", value: "adjustment" },
                          ]}
                          getOptionLabel={(option) => option.label}
                          value={[
                            { label: "Retour", value: "return" },
                            { label: "Ajustement", value: "adjustment" },
                          ].find((o) => o.value === field.value)}
                          onChange={(_, newValue) =>
                            field.onChange(newValue?.value)
                          }
                          renderInput={(params) => (
                            <TextField {...params} size="small" />
                          )}
                        />
                      )}
                    />
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="quantity"
                      className="flex items-center gap-2"
                    >
                      <ClipboardList className="w-4 h-4 text-emerald-600" />
                      Quantité
                    </FieldLabel>
                    <TextField
                      id="quantity"
                      type="number"
                      size="small"
                      onWheel={(e) => e.target.blur()}
                      {...register("quantity", {
                        required: "Requis",
                        validate: (val) => {
                          const num = Number(val);
                          if (num === 0)
                            return "La quantité ne peut pas être 0";
                          if (movementType === "return" && num < 1) {
                            return "Pour un retour, la quantité doit être au moins 1";
                          }
                          return true;
                        },
                      })}
                    />
                  </Field>
                </div>

                {movementType === "return" && (
                  <Field>
                    <FieldLabel
                      htmlFor="price"
                      className="flex items-center gap-2"
                    >
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      Prix à rembourser au client
                    </FieldLabel>
                    <TextField
                      id="price"
                      type="number"
                      size="small"
                      onWheel={(e) => e.target.blur()}
                      {...register("price", {
                        required: "Requis pour un retour",
                        min: {
                          value: 1,
                          message: "Le prix doit être au moins 1",
                        },
                           onChange: (e) => {
                          const priceMovementvalue = e.target.value;

                          setValue(
                            "note",
                            `Retour de ${quantityMovement} unités du produit ${selectedProduct?.name} a la date du ${new Date().toLocaleDateString()} est remboursement de ${priceMovementvalue} `,
                          );
                        },
                      })}
                    />
                    {errors.price && (
                      <FieldError>{errors.price.message}</FieldError>
                    )}
                  </Field>
                )}
                <Field>
                  <FieldLabel htmlFor="referenceModel">
                    Modèle de Référence (Auto)
                  </FieldLabel>
                  <TextField
                    id="referenceModel"
                    size="small"
                    disabled
                    {...register("referenceModel")}
                  />
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="note"
                    className="flex items-center gap-2"
                  >
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
