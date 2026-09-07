import { Button } from "@/components/ui/button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { X, Loader2 } from "lucide-react";
import ErrorAlert from "@/Component/Ui/ErrorAlert";
import IconButton from "@mui/material/IconButton";

export function ActionsModel({
  children,
  title = "Edit Profile",
  description,
  open,
  setIsOpen,
  handleSubmit,
  isPending,
  isError,
  error,
  errorTitle = "Erreur de validation",
  size = "md",
  type = "Add",
  onCancel,
}) {
  const handleClose = () => {
    onCancel?.();
    setIsOpen(false);
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={size}
      onClose={handleClose}
      scroll="paper"
      slotProps={{ paper: { className: "rounded-xl" } }}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-900">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          )}
        </div>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          size="small"
          className="!text-slate-400 hover:!bg-slate-100 hover:!text-slate-600"
        >
          <X className="h-4 w-4" />
        </IconButton>
      </div>

      <DialogContent className="max-h-[70vh] overflow-hidden p-0">
        <div className="px-6 py-5">
          {isError && (
            <ErrorAlert
              message={
                error?.message || "Une erreur est survenue lors du traitement."
              }
              title={errorTitle}
            />
          )}
          {children}
        </div>
      </DialogContent>

      <DialogActions className="border-t border-slate-100 px-6 py-3">
        <Button
          type="button"
          variant="ghost"
          onClick={handleClose}
          className="cursor-pointer font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          Annuler
        </Button>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="min-w-28 cursor-pointer gap-1.5 bg-[#0050CB] text-white hover:bg-[#0040a3]"
        >
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {type === "Add"
            ? isPending
              ? "Ajout..."
              : "Ajouter"
            : isPending
              ? "Modification..."
              : "Modifier"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
