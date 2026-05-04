import React, { useEffect } from "react";
import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AddPurchase } from "@/Servises/Purchases";
import { GetSuppliers } from "@/Servises/Suppliers";
import { GetProducts } from "@/Servises/Products";
import { toast } from "sonner";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  Plus,
  Trash2,
  ShoppingCart,
  Banknote,
  IdCard,
  FolderSync,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
      items: [{ product: "", quantity: 1, buyingPrice: 0 }],
      paidAmount: 0,
      paymentMethod: "cash",
      purchaseDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const PaymentMethods = [
    { label: "Cash", value: "cash", icon: <Banknote /> },
    { label: "Card", value: "card", icon: <IdCard /> },
    { label: "Transfer", value: "transfer", icon: <FolderSync /> },
  ];

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers"],
    queryFn: GetSuppliers,
  });

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: GetProducts,
  });

  const watchItems = watch("items");
  const paidAmount = watch("paidAmount");

  // Calculate total amount
  const totalAmount = watchItems.reduce((acc, item) => {
    return acc + Number(item.quantity) * Number(item.buyingPrice);
  }, 0);

  const debts = Math.max(0, totalAmount - paidAmount);

  useEffect(() => {
    if (paidAmount === totalAmount) {
      setValue("paymentStatus", "paid");
    } else if (paidAmount > 0) {
      setValue("paymentStatus", "partial");
    } else if (paidAmount === 0) {
      setValue("paymentStatus", "unpaid");
    }
  }, [paidAmount, totalAmount]);

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: AddPurchase,
    onSuccess: () => {
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      toast.success("L'achat a été ajouté avec succès");
      reset();
    },
  });

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      totalAmount,
      debts,
      paymentStatus:
        paidAmount >= totalAmount
          ? "paid"
          : paidAmount > 0
            ? "partial"
            : "unpaid",
    };
    mutate(formattedData);
  };
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <div>
      {isAdding && (
        <ActionsModel
          open={isAdding}
          setIsOpen={setIsAdding}
          title="Ajouter un Achat"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle="Échec de l'ajout"
          size="lg"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 max-h-[70vh] overflow-y-auto px-1 hide-scrollbar"
          >
            <FieldSet>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field className="md:col-span-1">
                  <FieldLabel htmlFor="supplier">Fournisseur</FieldLabel>
                  <Controller
                    name="supplier"
                    control={control}
                    rules={{ required: "Le fournisseur est requis" }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        options={suppliersData?.suppliers || []}
                        getOptionLabel={(option) => option.name || ""}
                        isOptionEqualToValue={(option, val) =>
                          option._id === val || option._id === val?._id
                        }
                        value={
                          suppliersData?.suppliers?.find(
                            (s) => s._id === value,
                          ) || null
                        }
                        onChange={(_, newValue) =>
                          onChange(newValue ? newValue._id : "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Sélectionner un fournisseur"
                          />
                        )}
                      />
                    )}
                  />
                  {errors.supplier && (
                    <FieldError>{errors.supplier.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="purchaseDate">Date d'achat</FieldLabel>
                  <TextField
                    id="purchaseDate"
                    type="date"
                    {...register("purchaseDate", {
                      required: "La date est requise",
                    })}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  Articles
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ product: "", quantity: 1, buyingPrice: 0 })
                  }
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Ajouter un article
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 items-end"
                >
                  <div className="md:col-span-5">
                    <FieldLabel>Produit</FieldLabel>
                    <Controller
                      name={`items.${index}.product`}
                      control={control}
                      rules={{ required: "Le produit est requis" }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <Autocomplete
                            options={productsData?.products || []}
                            getOptionLabel={(option) => option.name || ""}
                            isOptionEqualToValue={(option, val) =>
                              option._id === val || option._id === val?._id
                            }
                            value={
                              productsData?.products?.find(
                                (p) => p._id === value,
                              ) || null
                            }
                            onChange={(_, newValue) => {
                              onChange(newValue ? newValue._id : "");
                              if (newValue) {
                                setValue(
                                  `items.${index}.buyingPrice`,
                                  newValue.buyingPrice,
                                );
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                              />
                            )}
                          />
                          {error && <FieldError>{error.message}</FieldError>}
                        </>
                      )}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <FieldLabel>Quantité</FieldLabel>
                    <TextField
                      type="number"
                      size="small"
                      {...register(`items.${index}.quantity`, {
                        required: "La quantité est requise",
                        min: {
                          value: 1,
                          message: "La quantité doit être supérieure à 1",
                        },
                      })}
                    />
                    {errors.items?.[index]?.quantity && (
                      <FieldError>
                        {errors.items[index].quantity.message}
                      </FieldError>
                    )}
                  </div>
                  <div className="md:col-span-3">
                    <FieldLabel>Prix d'achat (DH)</FieldLabel>
                    <TextField
                      type="number"
                      size="small"
                      step="0.01"
                      {...register(`items.${index}.buyingPrice`, {
                        required: "Le prix d'achat est requis",
                        min: {
                          value: 0,
                          message: "Le prix d'achat doit être supérieur ou égal à 0",
                        },
                      })}
                    />
                    {errors.items?.[index]?.buyingPrice && (
                      <FieldError>
                        {errors.items[index].buyingPrice.message}
                      </FieldError>
                    )}
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <FieldSet>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Field>
                  <FieldLabel htmlFor="paymentMethod">
                    Méthode de paiement
                  </FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {PaymentMethods.map((p) => {
                      return (
                        <Button
                          key={p.value}
                          className={`cursor-pointer ${watch("paymentMethod") === p.value ? "bg-blue-600 text-white" : ""}`}
                          variant="outline"
                          type="button"
                          onClick={() => setValue("paymentMethod", p.value)}
                        >
                          {p.icon}
                          {p.label}
                        </Button>
                      );
                    })}
                  </div>
                  {errors.paymentMethod && (
                    <span className="text-red-500">
                      {errors.paymentMethod.message}
                    </span>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="notes">Notes</FieldLabel>
                  <TextField
                    id="notes"
                    multiline
                    rows={2}
                    {...register("notes")}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex flex-col">
                <span className="text-sm text-blue-600 font-medium">
                  Total Global
                </span>
                <span className="text-2xl font-bold text-blue-900">
                  {totalAmount.toLocaleString()} DH
                </span>
              </div>
              <div className="flex flex-col">
                <FieldLabel htmlFor="paidAmount">Montant Payé</FieldLabel>
                <TextField
                  id="paidAmount"
                  type="number"
                  step="0.01"
                  size="small"
                  {...register("paidAmount", { required: true, min: 0 })}
                  className="bg-white"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-amber-600 font-medium">
                  Dettes
                </span>
                <span className="text-2xl font-bold text-amber-700">
                  {debts.toLocaleString()} DH
                </span>
              </div>
            </div>
          </form>
        </ActionsModel>
      )}
    </div>
  );
}
