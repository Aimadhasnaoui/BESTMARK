import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import { Button } from "@/components/ui/button";
import { CheckCircle2, User, X } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "preparing", label: "Préparation" },
  { value: "on_route", label: "En route" },
  { value: "arrived", label: "Livré" },
  { value: "failed", label: "Échoué" },
  { value: "late", label: "En retard" },
];

export default function DeliveryFilters({
  statusFilter,
  setStatusFilter,
  deliveryManFilter,
  setDeliveryManFilter,
  deliveryManOptions,
  onReset,
  hasActiveFilters,
}) {
  return (
    <div className="flex flex-wrap items-end gap-4 p-4 my-4 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="flex flex-col gap-1.5 min-w-45">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Statut
        </label>
        <TextField
          select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className="flex flex-col gap-1.5 min-w-55 flex-1">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <User className="w-3.5 h-3.5 text-amber-500" />
          Livreur
        </label>
        <Autocomplete
          size="small"
          options={deliveryManOptions}
          getOptionLabel={(option) => option.name || ""}
          isOptionEqualToValue={(option, val) => option._id === val._id}
          value={deliveryManFilter}
          onChange={(_, newValue) => setDeliveryManFilter(newValue)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Tous les livreurs" />
          )}
        />
      </div>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={onReset}
          className="gap-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
        >
          <X className="w-4 h-4" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
