import { Button } from "@/components/ui/button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ErrorAlert from "@/Component/Ui/ErrorAlert";
import IconButton from "@mui/material/IconButton";

export function ActionsModel({
  children,
  title = "Edit Profile",
  open,
  setIsOpen,
  handleSubmit,
  isPending,
  isError,
  error,
  errorTitle = "Erreur de validation",
  size="md"
}) {
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={size}
      onClose={handleClose}
      scroll="paper"
    >
      <div className="w-full flex items-center justify-between px-4 py-2">
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <X />
        </IconButton>
      </div>
      <DialogContent
        dividers
        className="p-0 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* <Separator /> */}

        {/* Main Content Area */}
        <div className="p-6">
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

      {/* <Divider /> */}
      <DialogActions dividers className="  flex items-center gap-2">
        <div className="flex justify-end gap-4 w-full px-4 py-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 font-medium cursor-pointer"
          >
            Annuler
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-[#0050CB] hover:bg-[#0040a3] text-white px-8 cursor-pointer"
          >
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
