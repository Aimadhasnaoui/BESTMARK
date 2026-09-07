import React, { useState } from "react";
import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
import { ImageDropzone } from "@/Component/Ui/ImageDropzone";
import { NumberField } from "@/Component/Ui/NumberField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AddProduct } from "@/Servises/Products";
import { GetCategorys } from "@/Servises/ProductCategories";
import { GetSuppliers } from "@/Servises/Suppliers";
import { toast } from "react-hot-toast";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
export default function Add({ isAdding, setIsAdding }) {
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quantity: 0,
      minStockAlert: 5,
      Number_of_sales: 0,
      hassupplier: false,
    },
  });

  const hasSupplier = watch("hassupplier");

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: GetCategorys,
  });

  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers", { filter: { productTypes: watch("category") } }],
    queryFn: () => GetSuppliers({ queryKey: ["suppliers", { filter: { productTypes: watch("category") } }] }),
    enabled: !!(hasSupplier && watch("category"))
  });

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: AddProduct,
    onSuccess: () => {
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Le produit a été ajouté avec succès");
      reset();
      setImagePreview(null);
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
        return;
      }
      if (key === "supplier" && !data.hassupplier) return;
      if (value === undefined || value === null || value === "") return;
      formData.append(key, value);
    });
    mutate(formData);
  };



  return (
    <div>
      {isAdding && (
        <ActionsModel
          open={isAdding}
          setIsOpen={setIsAdding}
          title="Ajouter un produit"
          description="Renseignez les informations du nouveau produit."
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle="Échec de l'ajout"
          onCancel={() => {
            reset();
            setImagePreview(null);
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6  hide-scrollbar overflow-y-auto px-1"
          >
            <FieldSet>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field className="md:col-span-2">
                  <ImageDropzone
                    register={register}
                    name="image"
                    label="Photo du produit"
                    required="L'image du produit est requise"
                    preview={imagePreview}
                    onFileChange={handleImageChange}
                    onClear={() => setImagePreview(null)}
                    error={errors.image}
                  />
                </Field>

                <Field className="">
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
                        isOptionEqualToValue={(option, val) => option._id === val || option._id === val?._id}
                        value={categoriesData?.categories?.find((cat) => cat._id === value) || null}
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

               
              </FieldGroup>
            </FieldSet>

   

            <FieldSet >
           
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="buyingPrice">
                    Prix d'achat (DH)
                  </FieldLabel>
                  <NumberField
                    id="buyingPrice"
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
                  <NumberField
                    id="sellingPrice"
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
                  <FieldLabel htmlFor="quantity">Quantité initiale</FieldLabel>
                  <NumberField
                    id="quantity"
                    {...register("quantity", {
                      required: "La quantité est requise",
                      min: {
                        value: 0,
                        message: "La quantité doit être positive",
                      },
                    })}
                  />
                  {errors.quantity && (
                    <FieldError>{errors.quantity.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="minStockAlert">
                    Alerte stock faible
                  </FieldLabel>
                  <NumberField
                    id="minStockAlert"
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

   
            

            <FieldSet clasname='py-4'>
              <FieldGroup className="grid grid-cols-1 gap-4">
                <div className="flex flex-row items-center gap-1">
                  <input
                    id="hassupplier"
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    {...register("hassupplier")}
                  />
                  <FieldLabel htmlFor="hassupplier" className="mb-0">
                    A un fournisseur ?
                  </FieldLabel>
                </div>

                {hasSupplier && (
                  <Field>
                    <FieldLabel htmlFor="supplier">Fournisseur</FieldLabel>
                    {!watch("category") ? (
                      <Alert className="border-amber-200 bg-amber-50">
                        <Info className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-700">
                          Veuillez d'abord sélectionner une catégorie pour choisir un fournisseur.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Controller
                        name="supplier"
                        control={control}
                        rules={{
                          required: hasSupplier ? "Le fournisseur est requis quand 'A un fournisseur' est coché" : false
                        }}
                        render={({ field: { onChange, value } }) => (
                          <Autocomplete
                            disablePortal
                            options={suppliersData?.suppliers || []}
                            getOptionLabel={(option) => option.name || ""}
                            isOptionEqualToValue={(option, val) => option._id === val || option._id === val?._id}
                            value={suppliersData?.suppliers?.find((sup) => sup._id === value) || null}
                            onChange={(_, newValue) => {
                              onChange(newValue ? newValue._id : "");
                            }}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        )}
                      />
                    )}
                    {errors.supplier && (
                      <FieldError>{errors.supplier.message}</FieldError>
                    )}
                  </Field>
                )}
              </FieldGroup>
            </FieldSet>
          </form>
        </ActionsModel>
      )}
    </div>
  );
}
