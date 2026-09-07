import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, ArrowUpCircle, X } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "", label: "Tous les types" },
  { value: "sale", label: "Vente" },
  { value: "expense", label: "Dépense" },
  { value: "purchase", label: "Achat" },
];

const DIRECTION_OPTIONS = [
  { value: "", label: "Tous les flux" },
  { value: "in", label: "Entrée" },
  { value: "out", label: "Sortie" },
];

export default function TransactionsFilters({
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  typeFilter,
  setTypeFilter,
  directionFilter,
  setDirectionFilter,
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

      <div className="flex flex-col gap-1.5 min-w-45">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <Tag className="w-3.5 h-3.5 text-indigo-500" />
          Type
        </label>
        <TextField
          select
          size="small"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {TYPE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className="flex flex-col gap-1.5 min-w-45">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <ArrowUpCircle className="w-3.5 h-3.5 text-emerald-500" />
          Flux
        </label>
        <TextField
          select
          size="small"
          value={directionFilter}
          onChange={(e) => setDirectionFilter(e.target.value)}
        >
          {DIRECTION_OPTIONS.map((option) => (
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
