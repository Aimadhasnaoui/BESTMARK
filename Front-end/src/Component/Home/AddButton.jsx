import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { Plus, ShoppingCart, PackagePlus, X } from "lucide-react";

export default function AddButton({
  setBuyerModalOpen,
  setOpenAddSellerModal,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSell = () => {
    setIsOpen(false);
    setOpenAddSellerModal(true);
  };

  const handleBuy = () => {
    setIsOpen(false);
    setBuyerModalOpen(true);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-4 right-4 flex items-end gap-2 bg-blue-500 text-white px-4 py-4 rounded-full shadow-xl hover:bg-blue-600 cursor-pointer transition"
      >
        <Plus size={18} className="transition-transform group-hover:rotate-90" />
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { className: "rounded-xl" } }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Nouvelle action
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Que souhaitez-vous faire ?
            </p>
          </div>
          <IconButton
            aria-label="close"
            onClick={() => setIsOpen(false)}
            size="small"
            className="text-slate-400! hover:bg-slate-100! hover:text-slate-600!"
          >
            <X className="h-4 w-4" />
          </IconButton>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6">
          <button
            onClick={handleSell}
            className="group flex flex-col items-center gap-3 rounded-xl border-2 border-slate-100 p-5 text-center transition-all cursor-pointer hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 transition-colors group-hover:bg-emerald-200">
              <ShoppingCart className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-slate-800">Vendre</span>
          </button>

          <button
            onClick={handleBuy}
            className="group flex flex-col items-center gap-3 rounded-xl border-2 border-slate-100 p-5 text-center transition-all cursor-pointer hover:border-blue-300 hover:bg-blue-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-200">
              <PackagePlus className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-slate-800">Acheter</span>
          </button>
        </div>
      </Dialog>
    </>
  );
}
