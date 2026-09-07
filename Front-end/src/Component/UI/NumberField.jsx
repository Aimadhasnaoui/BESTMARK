import TextField from "@mui/material/TextField";

export function NumberField({ sx, ...props }) {
  return (
    <TextField
      type="number"
      onWheel={(e) => e.target.blur()}
      sx={{
        "& input[type=number]": {
          MozAppearance: "textfield",
        },
        "& input[type=number]::-webkit-outer-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
        ...sx,
      }}
      {...props}
    />
  );
}
