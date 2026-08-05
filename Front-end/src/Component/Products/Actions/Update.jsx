import React, { useEffect, useState } from "react";
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
import { UpdateProduct } from "@/Servises/Products";
import { GetCategorys } from "@/Servises/ProductCategories";
import { GetSuppliers } from "@/Servises/Suppliers";
import { toast } from "react-hot-toast";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Image } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

export default function Update({ isUpdating, setIsUpdating, selectedProduct }) {
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const hasSupplier = watch("hassupplier");

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: GetCategorys,
  });

  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () =>
      GetSuppliers({
        queryKey: [
          "suppliers",
          { filter: { productTypes: watch("category") } },
        ],
      }),
    enabled: !!(hasSupplier && watch("category")),
  });

  useEffect(() => {
    if (selectedProduct) {
      reset({
        name: selectedProduct.name,
        description: selectedProduct.description,
        barcode: selectedProduct.barcode,
        buyingPrice: selectedProduct.buyingPrice,
        sellingPrice: selectedProduct.sellingPrice,
        category: selectedProduct.category?._id || selectedProduct.category,
        quantity: selectedProduct.quantity,
        hassupplier: selectedProduct.hassupplier || !!selectedProduct.supplier,
        supplier: selectedProduct.supplier?._id || selectedProduct.supplier,
        minStockAlert: selectedProduct.minStockAlert,
        Number_of_sales: selectedProduct.Number_of_sales,
      });
      setImagePreview(null);
    }
  }, [selectedProduct, reset]);

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data) => UpdateProduct(selectedProduct._id, data),
    onSuccess: () => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Le produit a été mis à jour avec succès");
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image") {
        if (value?.[0]) formData.append("image", value[0]);
      } else {
        formData.append(key, value);
      }
    });
    mutate(formData);
  };

  return (
    <div>
      {isUpdating && (
        <ActionsModel
          open={isUpdating}
          setIsOpen={setIsUpdating}
          title="Modifier le produit"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle="Échec de la mise à jour"
          type="Update"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4  hide-scrollbar overflow-y-auto px-1"
          >
            <FieldSet>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="name">Nom du produit</FieldLabel>
                  <TextField
                    id="name"
                    placeholder="Ex: iPhone 15 Pro"
                    {...register("name", { required: "Le nom est requis" })}
                  />
                  {errors.name && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <TextField
                    id="description"
                    multiline
                    rows={3}
                    placeholder="Description détaillée du produit..."
                    {...register("description", {
                      required: "La description est requise",
                    })}
                  />
                  {errors.description && (
                    <FieldError>{errors.description.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="barcode">Code à barres</FieldLabel>
                  <TextField
                    id="barcode"
                    placeholder="Ex: 123456789012"
                    {...register("barcode")}
                  />
                </Field>

                <Field className="md:col-span-2 flex flex-row items-center gap-4">
                  <Avatar size="lg" className="rounded-md size-16">
                    {imagePreview || selectedProduct?.image ? (
                      <AvatarImage
                        src={imagePreview || getImageUrl(selectedProduct.image)}
                        alt="Aperçu"
                        className="rounded-md"
                      />
                    ) : (
                      <AvatarFallback className="rounded-md">
                        <Image className="w-5 h-5 text-slate-400" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <FieldLabel htmlFor="image">Photo du produit</FieldLabel>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      {...register("image", { onChange: handleImageChange })}
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="buyingPrice">
                    Prix d'achat (DH)
                  </FieldLabel>
                  <TextField
                    id="buyingPrice"
                    type="number"
                    step="0.01"
                    {...register("buyingPrice", {
                      required: "Le prix d'achat est requis",
                      min: { value: 0, message: "Le prix doit être positif" },
                    })}
                  />
                  {errors.buyingPrice && (
                    <FieldError>{errors.buyingPrice.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="sellingPrice">
                    Prix de vente (DH)
                  </FieldLabel>
                  <TextField
                    id="sellingPrice"
                    type="number"
                    step="0.01"
                    {...register("sellingPrice", {
                      required: "Le prix de vente est requis",
                      min: { value: 0, message: "Le prix doit être positif" },
                    })}
                  />
                  {errors.sellingPrice && (
                    <FieldError>{errors.sellingPrice.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="category">Catégorie</FieldLabel>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "La catégorie est requise" }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        disablePortal
                        options={categoriesData?.categories || []}
                        getOptionLabel={(option) => option.name || ""}
                        isOptionEqualToValue={(option, val) =>
                          option._id === val || option._id === val?._id
                        }
                        value={
                          categoriesData?.categories?.find(
                            (cat) => cat._id === value,
                          ) || null
                        }
                        onChange={(_, newValue) => {
                          onChange(newValue ? newValue._id : "");
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                  {errors.category && (
                    <FieldError>{errors.category.message}</FieldError>
                  )}
                </Field>

                <Field className="flex flex-row items-center gap-2">
                  <input
                    id="hassupplier"
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    {...register("hassupplier")}
                  />
                  <FieldLabel htmlFor="hassupplier" className="mb-0">
                    A un fournisseur ?
                  </FieldLabel>
                </Field>

                {hasSupplier && (
                  <Field>
                    <FieldLabel htmlFor="supplier">Fournisseur</FieldLabel>
                    <Controller
                      name="supplier"
                      control={control}
                      rules={{
                        required: hasSupplier
                          ? "Le fournisseur est requis quand 'A un fournisseur' est coché"
                          : false,
                      }}
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          disablePortal
                          options={suppliersData?.suppliers || []}
                          getOptionLabel={(option) => option.name || ""}
                          isOptionEqualToValue={(option, val) =>
                            option._id === val || option._id === val?._id
                          }
                          value={
                            suppliersData?.suppliers?.find(
                              (sup) => sup._id === value,
                            ) || null
                          }
                          onChange={(_, newValue) => {
                            onChange(newValue ? newValue._id : "");
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      )}
                    />
                    {errors.supplier && (
                      <FieldError>{errors.supplier.message}</FieldError>
                    )}
                  </Field>
                )}
                <Field>
                  <FieldLabel htmlFor="minStockAlert">
                    Alerte stock faible
                  </FieldLabel>
                  <TextField
                    id="minStockAlert"
                    type="number"
                    {...register("minStockAlert", {
                      min: {
                        value: 0,
                        message: "La valeur doit être positive",
                      },
                    })}
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
