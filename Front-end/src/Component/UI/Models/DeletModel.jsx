import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Trash2, AlertTriangle, X } from "lucide-react";
import ErrorAlert from "../ErrorAlert";
export default function DeletModel({
  open,
  setIsOpen,
  handelDelet,
  title = "Supprimer ?",
  description,
  isPending,
  itemName = "",
  haswaring = false,
  hasWaringMsg = "",
  DeleteMsg = "",
  isError,
  error,
  errorTitle="Erreur de validation",
}) {
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[420px] p-0 overflow-hidden border-none bg-white shadow-2xl rounded-3xl animate-in fade-in zoom-in duration-300"
      >
        {isError && (
          <ErrorAlert
            message={error?.message || "Une erreur est survenue lors du traitement."}
            title={errorTitle}
          />
        )}
        <div className="flex flex-col items-center pt-12 pb-8 px-8 text-center">
          {/* Circular Trash Icon with Glow Effect */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-red-50 rounded-full scale-[2.2] opacity-70 blur-sm" />
            <div className="relative bg-red-50 p-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
              <Trash2 className="h-8 w-8 text-[#C21E1E]" />
              <div className="absolute -top-1 -right-1 bg-[#C21E1E] rounded-full p-0.5 border-2 border-white">
                <X className="h-2.5 w-2.5 text-white stroke-[3px]" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[24px] font-bold text-[#1E293B] leading-tight">
              {title}
            </h2>

            <p className="text-[#64748B] text-[15.5px] leading-relaxed">
              {description || (
                <>
                  {DeleteMsg || (
                    <>
                      Êtes-vous sûr de vouloir supprimer{" "}
                      <span className="font-bold text-[#1E293B]">
                        "{itemName || "cet élément"}"
                      </span>
                      ? Cette action{" "}
                      <span className="text-[#C21E1E] underline italic decoration-1 underline-offset-4 font-medium">
                        est irréversible
                      </span>{" "}
                      et peut affecter les enregistrements d'inventaire, l'historique des rapports et les alertes de stock.
                    </>
                  )}
                </>
              )}
            </p>
          </div>

          <div className="flex w-full gap-4 mt-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-7 border-[#E2E8F0] text-[#64748B] hover:bg-slate-50 transition-all duration-200 font-bold text-base rounded-2xl border-2 cursor-pointer"
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handelDelet}
              disabled={isPending}
              className="flex-1 py-7 bg-[#C21E1E] hover:bg-[#A61919] text-white shadow-lg shadow-red-100 transition-all duration-200 font-bold text-base rounded-2xl cursor-pointer"
            >
              {isPending ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Supprimer"
              )}
            </Button>
          </div>
        </div>
        {haswaring && (
          <div className="bg-[#F8FAFC] py-5 px-8 flex items-center gap-3 border-t border-[#F1F5F9]">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <p className="text-[11px] font-extrabold text-[#94A3B8] leading-tight tracking-[0.05em] uppercase text-left">
              {hasWaringMsg || "ATTENTION : LES ÉLÉMENTS ASSOCIÉS PERDRONT CETTE CATÉGORIE."}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
