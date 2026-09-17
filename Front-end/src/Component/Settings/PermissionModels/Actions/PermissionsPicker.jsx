import { useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@/components/ui/button";
import { Plus, X, CheckCheck } from "lucide-react";

const PRESET_PERMISSIONS = ["Ajouter", "Modifier", "Supprimer", "Consulter"];
const OTHER_VALUE = "__autre__";

export default function PermissionsPicker({
  value = [],
  onChange,
  options = PRESET_PERMISSIONS,
}) {
  const [preset, setPreset] = useState(options[0] || OTHER_VALUE);
  const [customValue, setCustomValue] = useState("");

  const handleAdd = () => {
    const permission = (preset === OTHER_VALUE ? customValue : preset).trim();
    if (!permission || value.includes(permission)) return;
    onChange([...value, permission]);
    setCustomValue("");
  };

  const handleRemove = (permission) => {
    onChange(value.filter((p) => p !== permission));
  };

  const handleSelectAll = () => {
    const merged = [...value];
    options.forEach((option) => {
      if (!merged.includes(option)) merged.push(option);
    });
    onChange(merged);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {value.length === 0 && (
          <p className="text-sm text-slate-400">Aucune permission ajoutée</p>
        )}
        {value.map((permission) => (
          <span
            key={permission}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#0050CB]/10 px-2.5 py-1 text-xs font-medium text-[#0050CB] ring-1 ring-inset ring-[#0050CB]/20"
          >
            {permission}
            <button
              type="button"
              onClick={() => handleRemove(permission)}
              className="rounded-full hover:bg-[#0050CB]/20"
            >
              <X className="h-3 w-3 cursor-pointer" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <TextField
          select
          size="small"
          value={preset}
          onChange={(e) => setPreset(e.target.value)}
          className="min-w-40"
        >
          {options.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
          <MenuItem value={OTHER_VALUE}>Autre</MenuItem>
        </TextField>

        {preset === OTHER_VALUE && (
          <TextField
            size="small"
            placeholder="Nom de la permission"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
          />
        )}

        <Button
          type="button"
          size="sm"
          onClick={handleAdd}
          disabled={preset === OTHER_VALUE && !customValue.trim()}
          className="cursor-pointer bg-[#0050CB] text-white hover:bg-[#0050CB]/90"
        >
          <Plus className="h-4 w-4" />
        </Button>

        {options.length > 0 && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleSelectAll}
            className="cursor-pointer gap-1.5"
          >
            <CheckCheck className="h-4 w-4" />
            Tout sélectionner
          </Button>
        )}
      </div>
    </div>
  );
}
