import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "@tanstack/react-query";
import { GetCategorys } from "@/Servises/ProductCategories";
import { GetSuppliers } from "@/Servises/Suppliers";
import { Button } from "@/components/ui/button";
import { Layers, Truck, X } from "lucide-react";

export default function ProductFilters({ currentFilters, onApplyFilters }) {
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: GetCategorys,
  });

  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers", {}],
    queryFn: GetSuppliers,
  });

  const category = currentFilters?.category || null;
  const supplier = currentFilters?.supplier || null;
  const hasActiveFilters = !!(category || supplier);

  const handleReset = () => onApplyFilters({ category: null, supplier: null });

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 mb-4 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="flex flex-col gap-1.5 min-w-55">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          Catégorie
        </label>
        <Autocomplete
          size="small"
          options={categoriesData?.categories || []}
          getOptionLabel={(option) => option.name || ""}
          isOptionEqualToValue={(option, val) => option._id === val?._id}
          value={category}
          onChange={(_, newValue) =>
            onApplyFilters({ ...currentFilters, category: newValue })
          }
          renderInput={(params) => (
            <TextField {...params} placeholder="Toutes les catégories" />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5 min-w-55">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <Truck className="w-3.5 h-3.5 text-amber-500" />
          Fournisseur
        </label>
        <Autocomplete
          size="small"
          options={suppliersData?.suppliers || []}
          getOptionLabel={(option) => option.name || ""}
          isOptionEqualToValue={(option, val) => option._id === val?._id}
          value={supplier}
          onChange={(_, newValue) =>
            onApplyFilters({ ...currentFilters, supplier: newValue })
          }
          renderInput={(params) => (
            <TextField {...params} placeholder="Tous les fournisseurs" />
          )}
        />
      </div>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={handleReset}
          className="gap-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
        >
          <X className="w-4 h-4" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
