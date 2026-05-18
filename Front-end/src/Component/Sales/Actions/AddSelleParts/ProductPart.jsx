import React from "react";
import { Button } from "@/components/ui/button";
import { FieldError, FieldLabel } from "@/components/ui/field";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  Plus,
  Trash2,
  PackageSearch,
  ClipboardPenLine,
  Package,
} from "lucide-react";

export default function ProductPart({
  Controller,
  append,
  fields,
  errors,
  control,
  watchItems,
  productsData,
  register,
  remove,
}) {
  return (
    <div className="border-2 border-[#E2E8F0] p-4 rounded-md flex flex-col h-full">
      <div className="flex items-center justify-between my-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ClipboardPenLine className="w-5 h-5 text-blue-600" />
          Sélection d'articles
        </h3>
      </div>
      <div>
        <div className="my-4">
          <Controller
            name={`product`}
            control={control}
            rules={{
              required:
                !watchItems || watchItems.length === 0
                  ? "veuillez sélectionner un produit"
                  : false,
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Autocomplete
                  options={productsData?.products || []}
                  getOptionLabel={(option) => option.name || ""}
                  isOptionEqualToValue={(option, val) =>
                    option._id === val || option._id === val?._id
                  }
                  value={
                    productsData?.products?.find((p) => p._id === value) || null
                  }
                  onChange={(_, newValue) => {
                    if (newValue) {
                      append({
                        product: newValue._id,
                        quantity: 1,
                        buyingPrice: newValue.buyingPrice,
                        productDetials: newValue,
                        sellingPrice: newValue.buyingPrice * 1,
                      });
                      // Reset the autocomplete input to empty after adding
                      onChange("");
                    }
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
      </div>

      {fields.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-8 text-center my-4 bg-slate-50/50">
          <Package className="w-12 h-12 text-slate-400 mb-3 stroke-[1.5]" />
          <p className="text-slate-600 font-medium text-sm">Aucun produit sélectionné</p>
          <p className="text-slate-400 text-xs mt-1">Veuillez rechercher et sélectionner un produit ci-dessus pour l'ajouter à la vente.</p>
        </div>
      ) : (
        <div className="max-h-[300px] overflow-y-auto hide-scrollbar pr-2 mt-4 space-y-4">
          {fields.map((field, index) => {
            const currentQuantity =
              watchItems?.[index]?.quantity ?? field.quantity ?? 1;
            const currentPrice =
              watchItems?.[index]?.buyingPrice ?? field.buyingPrice ?? 0;
            const totalPrice = (currentQuantity * currentPrice).toFixed(2);

            return (
              <div
                key={field.id}
                className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-lg border border-slate-200"
              >
                <div>
                  <div className="w-full flex gap-2 items-center">
                    <div className=" rounded-md ">
                      {field.productDetials.image ? (
                        <img
                          src={field.productDetials.image}
                          alt={field.productDetials.name}
                          className="w-[100px] h-[100px] rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h1 className="font-bold"> {field.productDetials.name}</h1>
                    </div>
                  </div>
                </div>
                <div className=" ">
                  <FieldLabel>Quantité</FieldLabel>
                  <TextField
                    type="number"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                      },
                      "& .MuiAutocomplete-input": {
                        paddingLeft: "35px !important",
                      },
                    }}
                    {...register(`items.${index}.quantity`, {
                      required: "La quantité est requise",
                      valueAsNumber: true,
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
                <div className=" ">
                  <FieldLabel>Prix (DH)</FieldLabel>
                  <TextField
                    type="number"
                    size="small"
                    step="0.01"
                    {...register(`items.${index}.buyingPrice`, {
                      required: "Le prix d'achat est requis",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Le prix doit être supérieur ou égal à 0",
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
                    {totalPrice} DH
                  </div>
                </div>
                <div className="md:col-span-1 flex justify-center pb-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
