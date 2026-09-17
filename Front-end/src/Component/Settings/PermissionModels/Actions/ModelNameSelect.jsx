import { useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { AVAILABLE_MODELS } from "./AvailableModels";

const OTHER_VALUE = "__autre__";

export default function ModelNameSelect({ value, onChange, error }) {
  const [mode, setMode] = useState(
    value && !AVAILABLE_MODELS.includes(value) ? OTHER_VALUE : "list",
  );

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === OTHER_VALUE) {
      setMode(OTHER_VALUE);
      onChange("");
    } else {
      setMode("list");
      onChange(val);
    }
  };

  return (
    <div className="space-y-2">
      <TextField
        select
        fullWidth
        value={mode === OTHER_VALUE ? OTHER_VALUE : value}
        onChange={handleSelectChange}
        error={!!error}
      >
        {AVAILABLE_MODELS.map((model) => (
          <MenuItem key={model} value={model}>
            {model}
          </MenuItem>
        ))}
        <MenuItem value={OTHER_VALUE}>Autre</MenuItem>
      </TextField>

      {mode === OTHER_VALUE && (
        <TextField
          fullWidth
          autoComplete="off"
          placeholder="Nom du modèle"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
