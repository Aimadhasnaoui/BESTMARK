import React, { useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
import { toast } from "react-hot-toast";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  Plus,
  Trash2,
  ShoppingCart,
  PackageSearch,
  ArrowLeft,
  ArrowRight,
  ClipboardPenLine,
} from "lucide-react";
import { DataContext } from "@/Component/Data/contextApi";
import ErrorAlert from "@/Component/Ui/ErrorAlert";
import IconButton from "@mui/material/IconButton";
export default function AddSlle() {
  const { openAddSellerModal, setOpenAddSellerModal } = useContext(DataContext);
  const {
    register,
    reset,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: [{ product: "", quantity: 1, buyingPrice: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const watchItems = watch("items");
  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: () => GetProducts(),
  });

  useEffect(()=>{
    console.log(watchItems)
  },[watchItems])

  function handleClose() {
    setOpenAddSellerModal(false);
  }
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Dialog
      open={true}
      fullWidth
      maxWidth="lg"
      onClose={handleClose}
      scroll="paper"
    >
      <DialogTitle>
        <div className="w-full flex gap-2 items-center">
          <div className="bg-[#EFF6FF] p-2 rounded-md">
            <ShoppingCart size={24} color="#2563EB"></ShoppingCart>
          </div>
          <Typography variant="h6" component="div">
            Ajouter un nouvelle vente
          </Typography>
        </div>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <X />
        </IconButton>
      </DialogTitle>
      <Divider></Divider>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border-2 border-[#E2E8F0] p-4 rounded-md">
            <div className="flex items-center justify-between my-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ClipboardPenLine className="w-5 h-5 text-blue-600" />
                Sélection d'articles
              </h3>
              <div
                onClick={() =>
                  append({ product: "", quantity: 1, buyingPrice: 0 })
                }
                className="flex items-center gap-1 text-[#2563EB] cursor-pointer hover:text-[#2564ebb3]"
              >
                <Plus className="w-4 h-4 border-2 border-[#2563EB] rounded-md" />{" "}
                Ajouter un article
              </div>
            </div>
            {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4  rounded-lg border border-slate-200 items-end mb-4"
                >
                  <div className="md:col-span-4">
                                <Controller
                    name={`items.${index}.product`}
                    control={control}
                    rules={{ required: "veuillez sélectionner un produit" }}
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
                            onChange(newValue ? newValue._id: "");
                            console.log(newValue);
                          }}
                          popupIcon={null}
                          renderInput={(params) => (
                            <div className="relative">
                              <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                placeholder="Rechercher un produit par nom..."
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    // backgroundColor: "#F1F5F9",
                                    borderRadius: 1,
                                  },
                                  "& .MuiAutocomplete-input": {
                                    paddingLeft: "35px !important",
                                  },
                                }}
                              />
                              <PackageSearch
                                className="absolute top-2 left-2"
                                color="#2563EB"
                              ></PackageSearch>
                            </div>
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
                  <div className="md:col-span-2">
                    <FieldLabel>Prix d'achat (DH)</FieldLabel>
                    <TextField
                      type="number"
                      size="small"
                      step="0.01"
                      {...register(`items.${index}.buyingPrice`, {
                        required: "Le prix d'achat est requis",
                        min: {
                          value: 0,
                          message:
                            "Le prix d'achat doit être supérieur ou égal à 0",
                        },
                      })}
                    />
                    {errors.items?.[index]?.buyingPrice && (
                      <FieldError>
                        {errors.items[index].buyingPrice.message}
                      </FieldError>
                    )}
                  </div>
                  <div className="md:col-span-3">
                    <FieldLabel>Prix Total (DH)</FieldLabel>
                    <div className="flex items-center h-10 font-bold text-blue-600 bg-white px-3">
                      {(
                        (watchItems?.[index]?.buyingPrice || 0) *
                        (watchItems?.[index]?.quantity || 0)
                      ).toLocaleString()}{" "}
                      DH
                    </div>
                  </div>
                  <div className="md:col-span-1 flex justify-center pb-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
            ))}
          </div>
        </form>
      </DialogContent>
      <Divider></Divider>
      <DialogActions>
        <div className="flex justify-between items-center w-full py-2 px-4">
          <button
            onClick={handleClose}
            className="text-[#94A3B8] font-normal text-[16px] cursor-pointer"
          >
            Annuler & fermer
          </button>
          <div className="flex gap-4">
            <button className="flex items-center gap-1.5 py-2 px-3 rounded-md cursor-pointer shadow-md">
              <ArrowLeft size={12}></ArrowLeft>
              Précédent
            </button>
            <button className="flex items-center gap-1.5 bg-[#0050CB] text-white py-2 px-3 rounded-md cursor-pointer">
              Prochaine étape
              <ArrowRight size={12}></ArrowRight>
            </button>
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
}
