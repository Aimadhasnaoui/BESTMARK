import { ActionsModel } from "@/Component/Ui/Models/ActionsModel";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { GetCategorys } from "@/Servises/ProductCategories";
import { GetSuppliers } from "@/Servises/Suppliers";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function Filter({ isFiltering, setIsFiltering, onApplyFilters, currentFilters }) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: currentFilters || { category: null, supplier: null },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: GetCategorys,
  });

  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers", {}],
    queryFn: GetSuppliers,
  });

  const onSubmit = (data) => {
    onApplyFilters(data);
    setIsFiltering(false);
  };

  const handleReset = () => {
    const defaults = { category: null, supplier: null };
    reset(defaults);
    onApplyFilters(defaults);
    setIsFiltering(false);
  };

  return (
    <ActionsModel
      open={isFiltering}
      setIsOpen={setIsFiltering}
      title="Filtrer les produits"
      description="Affinez la liste par catégorie ou par fournisseur."
      handleSubmit={handleSubmit(onSubmit)}
      type="Filter"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-1">
        <FieldSet>
          <FieldGroup className="space-y-6">
            <Field>
              <FieldLabel>Catégorie</FieldLabel>
              <Controller
                name="category"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    options={categoriesData?.categories || []}
                    getOptionLabel={(option) => option.name || ""}
                    isOptionEqualToValue={(option, val) => option._id === val?._id}
                    value={value || null}
                    onChange={(_, newValue) => onChange(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Toutes les catégories" />
                    )}
                  />
                )}
              />
            </Field>

            <Field>
              <FieldLabel>Fournisseur</FieldLabel>
              <Controller
                name="supplier"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    options={suppliersData?.suppliers || []}
                    getOptionLabel={(option) => option.name || ""}
                    isOptionEqualToValue={(option, val) => option._id === val?._id}
                    value={value || null}
                    onChange={(_, newValue) => onChange(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Tous les fournisseurs" />
                    )}
                  />
                )}
              />
            </Field>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>
    </ActionsModel>
  );
}
