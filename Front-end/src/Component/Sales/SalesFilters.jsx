import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import { Button } from "@/components/ui/button";
import { Calendar, User, Truck, X } from "lucide-react";

const DELIVERY_OPTIONS = [
  { value: "", label: "Toutes les ventes" },
  { value: "yes", label: "Avec livraison" },
  { value: "no", label: "Sans livraison" },
];

export default function SalesFilters({
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  userFilter,
  setUserFilter,
  userOptions,
  deliveryFilter,
  setDeliveryFilter,
  onReset,
  hasActiveFilters,
}) {
  return (
    <div className="flex flex-wrap items-end gap-4 p-4 my-4 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="flex flex-col gap-1.5 min-w-40">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <Calendar className="w-3.5 h-3.5 text-blue-500" />
          Du
        </label>
        <TextField
          type="date"
          size="small"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5 min-w-40">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <Calendar className="w-3.5 h-3.5 text-blue-500" />
          Au
        </label>
        <TextField
          type="date"
          size="small"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5 min-w-55 flex-1">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <User className="w-3.5 h-3.5 text-emerald-500" />
          Utilisateur
        </label>
        <Autocomplete
          size="small"
          options={userOptions}
          getOptionLabel={(option) => option.name || ""}
          isOptionEqualToValue={(option, val) => option._id === val._id}
          value={userFilter}
          onChange={(_, newValue) => setUserFilter(newValue)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Tous les utilisateurs" />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5 min-w-45">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <Truck className="w-3.5 h-3.5 text-amber-500" />
          Livraison
        </label>
        <TextField
          select
          size="small"
          value={deliveryFilter}
          onChange={(e) => setDeliveryFilter(e.target.value)}
        >
          {DELIVERY_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
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
