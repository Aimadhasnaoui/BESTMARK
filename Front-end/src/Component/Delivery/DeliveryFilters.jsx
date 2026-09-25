import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import { Button } from "@/components/ui/button";
import { CheckCircle2, User, X } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "on_route", label: "En route" },
  { value: "late", label: "En retard" },
  { value: "preparing", label: "Préparation" },
  { value: "arrived", label: "Livré" },
  { value: "failed", label: "Échoué" },
  { value: "", label: "Tous" },
];

const STATUS_COLORS = {
  "": {
    inactive: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
    active:
      "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10 font-semibold",
    dot: "bg-slate-400",
  },
  pending: {
    inactive:
      "bg-slate-100/80 text-slate-700 border-slate-200/80 hover:bg-slate-200/60",
    active:
      "bg-slate-700 text-white border-slate-700 shadow-md ring-2 ring-slate-700/10 font-semibold",
    dot: "bg-slate-500",
  },
  preparing: {
    inactive:
      "bg-blue-50 text-blue-700 border-blue-200/70 hover:bg-blue-100/70",
    active:
      "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/10 font-semibold",
    dot: "bg-blue-500",
  },
  on_route: {
    inactive:
      "bg-amber-50 text-amber-700 border-amber-200/70 hover:bg-amber-100/70",
    active:
      "bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-500/10 font-semibold",
    dot: "bg-amber-500",
  },
  arrived: {
    inactive:
      "bg-emerald-50 text-emerald-700 border-emerald-200/70 hover:bg-emerald-100/70",
    active:
      "bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-600/10 font-semibold",
    dot: "bg-emerald-500",
  },
  failed: {
    inactive: "bg-red-50 text-red-700 border-red-200/70 hover:bg-red-100/70",
    active:
      "bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-600/10 font-semibold",
    dot: "bg-red-500",
  },
  late: {
    inactive:
      "bg-rose-50 text-rose-700 border-rose-200/70 hover:bg-rose-100/70",
    active:
      "bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-600/10 font-semibold",
    dot: "bg-rose-500",
  },
};

export default function DeliveryFilters({
  statusFilter,
  setStatusFilter,
  deliveryManFilter,
  setDeliveryManFilter,
  deliveryManOptions,
  onReset,
  hasActiveFilters,
  isLivreur = false,
}) {
  if (isLivreur) {
    return (
      <div
        className="flex items-center gap-2.5 overflow-x-auto p-2.5 my-4 bg-slate-100/70 border border-slate-200/50 rounded-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {STATUS_OPTIONS.map((option) => {
          const isActive = statusFilter === option.value;
          const colorConfig = STATUS_COLORS[option.value] || STATUS_COLORS[""];
          return (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setStatusFilter(
                  isActive && option.value !== "" ? "" : option.value,
                )
              }
              className={`inline-flex items-center gap-2 px-4.5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer border shadow-xs ${
                isActive ? colorConfig.active : colorConfig.inactive
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  isActive ? "bg-white" : colorConfig.dot
                }`}
              />
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

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
              {option.value === "" ? "Tous les statuts" : option.label}
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
