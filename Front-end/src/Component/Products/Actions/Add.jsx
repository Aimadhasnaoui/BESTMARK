import React from "react";
import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { AddProduct } from "@/Servises/Products";
import { GetCategorys } from "@/Servises/ProductCategories";
import { GetSuppliers } from "@/Servises/Suppliers";
import { toast } from "sonner";

export default function Add({ isAdding, setIsAdding }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quantity: 0,
      minStockAlert: 5,
      Number_of_sales: 0,
      hassupplier: false,
    }
  });

  const hasSupplier = watch("hassupplier");

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: GetCategorys,
  });

  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers"],
    queryFn: GetSuppliers,
  });

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: AddProduct,
    onSuccess: () => {
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Le produit a été ajouté avec succès");
      reset();
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  const selectClass = "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30";

  return (
    <div>
      {isAdding && (
        <ActionsModel
          open={isAdding}
          setIsOpen={setIsAdding}
          title="Ajouter un produit"
          handleSubmit={handleSubmit(onSubmit)}
          isPending={isPending}
          isError={isError}
          error={error}
          errorTitle="Échec de l'ajout"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[40vh] hide-scrollbar overflow-y-auto px-1">
            <FieldSet>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="name">Nom du produit</FieldLabel>
                  <Input
                    id="name"
                    placeholder="Ex: iPhone 15 Pro"
                    {...register("name", { required: "Le nom est requis" })}
                  />
                  {errors.name && <FieldError>{errors.name.message}</FieldError>}
                </Field>

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="Description détaillée du produit..."
                    {...register("description", { required: "La description est requise" })}
                  />
                  {errors.description && <FieldError>{errors.description.message}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="barcode">Code à barres</FieldLabel>
                  <Input
                    id="barcode"
                    placeholder="Ex: 123456789012"
                    {...register("barcode")}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="image">URL de l'image</FieldLabel>
                  <Input
                    id="image"
                    placeholder="https://..."
                    {...register("image", { required: "L'URL de l'image est requise" })}
                  />
                  {errors.image && <FieldError>{errors.image.message}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="buyingPrice">Prix d'achat (DH)</FieldLabel>
                  <Input
                    id="buyingPrice"
                    type="number"
                    step="0.01"
                    {...register("buyingPrice", { 
                        required: "Le prix d'achat est requis",
                        min: { value: 0, message: "Le prix doit être positif" }
                    })}
                  />
                  {errors.buyingPrice && <FieldError>{errors.buyingPrice.message}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="sellingPrice">Prix de vente (DH)</FieldLabel>
                  <Input
                    id="sellingPrice"
                    type="number"
                    step="0.01"
                    {...register("sellingPrice", { 
                        required: "Le prix de vente est requis",
                        min: { value: 0, message: "Le prix doit être positif" }
                    })}
                  />
                  {errors.sellingPrice && <FieldError>{errors.sellingPrice.message}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="category">Catégorie</FieldLabel>
                  <select
                    id="category"
                    className={selectClass}
                    {...register("category", { required: "La catégorie est requise" })}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categoriesData?.categories?.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && <FieldError>{errors.category.message}</FieldError>}
                </Field>

                <Field className="flex flex-row items-center gap-2">
                  <input
                    id="hassupplier"
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    {...register("hassupplier")}
                  />
                  <FieldLabel htmlFor="hassupplier" className="mb-0">A un fournisseur ?</FieldLabel>
                </Field>

                {hasSupplier && (
                  <Field>
                    <FieldLabel htmlFor="supplier">Fournisseur</FieldLabel>
                    <select
                      id="supplier"
                      className={selectClass}
                      {...register("supplier", { required: "Le fournisseur est requis quand 'A un fournisseur' est coché" })}
                    >
                      <option value="">Sélectionner un fournisseur</option>
                      {suppliersData?.suppliers?.map((sup) => (
                        <option key={sup._id} value={sup._id}>{sup.name}</option>
                      ))}
                    </select>
                    {errors.supplier && <FieldError>{errors.supplier.message}</FieldError>}
                  </Field>
                )}

                <Field>
                  <FieldLabel htmlFor="quantity">Quantité initiale</FieldLabel>
                  <Input
                    id="quantity"
                    type="number"
                    {...register("quantity", { 
                        required: "La quantité est requise",
                        min: { value: 0, message: "La quantité doit être positive" }
                    })}
                  />
                  {errors.quantity && <FieldError>{errors.quantity.message}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="minStockAlert">Alerte stock faible</FieldLabel>
                  <Input
                    id="minStockAlert"
                    type="number"
                    {...register("minStockAlert", { 
                        min: { value: 0, message: "La valeur doit être positive" }
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
