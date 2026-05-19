import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import { useQuery } from "@tanstack/react-query";
import { GetProducts } from "@/Servises/Products";
import {
  X,
  User,
  Van,
  Phone,
  Banknote,
  IdCard,
  FolderSync,
  Printer,
  Package
} from "lucide-react";
import IconButton from "@mui/material/IconButton";

export default function SellFacture({
  openFactue,
  setopenFactue,
  FactureData,
}) {
  function handleClose() {
    setopenFactue(false);
  }

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: () => GetProducts(),
  });

  const getProductName = (productId) => {
    if (!productId) return "Produit inconnu";
    if (typeof productId === "object" && productId.name) return productId.name;
    const found = productsData?.products?.find((p) => p._id === productId);
    return found ? found.name : "Produit #" + productId.substring(0, 8);
  };

  const getPaymentMethodDetails = (method) => {
    switch (method) {
      case "cash":
        return { label: "Cash", icon: <Banknote size={16} className="text-emerald-500" /> };
      case "card":
        return { label: "Carte", icon: <IdCard size={16} className="text-blue-500" /> };
      case "transfer":
        return { label: "Virement", icon: <FolderSync size={16} className="text-purple-500" /> };
      default:
        return { label: method || "N/A", icon: <Banknote size={16} /> };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Dialog
      open={openFactue}
      fullWidth
      maxWidth="sm"
      onClose={handleClose}
      scroll="paper"
    >
      <DialogTitle sx={{ background: '#F8FAFC' }}>
        <div className="w-full my-2">
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
        <div className="flex justify-between items-center my-2 text-slate-800">
          <div>
            <h2 className="text-[#94A3B8] text-[12px] font-bold tracking-wider">NUMÉRO DE FACTURE</h2>
            <p className="text-[#0F172A] text-[18px] font-bold">{FactureData?.invoiceNumber || "N/A"}</p>
          </div>
          <div className="text-right">
            <div className="text-[#1E293B] text-[13px]">
              <span className="text-[#64748B] font-medium">Date: </span>
              {formatDate(FactureData?.saleDate || FactureData?.createdAt)}
            </div>
            <div className="text-[#1E293B] text-[13px] mt-0.5">
              <span className="text-[#64748B] font-medium">Vendu par: </span>
              {FactureData?.servedBy?.name || "N/A"}
            </div>
          </div>
        </div>
      </DialogTitle>
      <Divider />
      <DialogContent className="space-y-4">
        {/* Client & Delivery Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 w-full">
            <h1 className="flex items-center gap-2 text-[#64748B] text-sm">
              <User color="#0050CB" size={14} /> DÉTAILS DU CLIENT
            </h1>
            <div className="bg-[#F8FAFC] border border-slate-100 px-4 py-3 rounded-xl flex flex-col gap-1.5 h-full justify-center">
              <p className="text-[#0F172A] text-[15px] font-bold">
                {FactureData?.customerName || "Client Comptant"}
              </p>
              <p className="text-[#64748B] text-[13px] flex items-center gap-1.5">
                <Phone size={13} /> {FactureData?.customerPhone || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <h1 className="flex items-center gap-2 text-[#64748B] text-sm">
              <Van color="#0050CB" size={14} /> LIVRAISON
            </h1>
            <div className="bg-[#F8FAFC] border border-slate-100 px-4 py-3 rounded-xl flex flex-col gap-2 h-full justify-between">
              <div className="flex justify-between items-center text-sm">
                <p className="text-[#64748B]">Requiert Livraison</p>
                <p className={`px-2 py-0.5 rounded text-xs font-semibold ${FactureData?.requiresDelivery ? "text-amber-700 bg-amber-100" : "text-slate-600 bg-slate-100"}`}>
                  {FactureData?.requiresDelivery ? "Oui" : "Non"}
                </p>
              </div>
              <Divider className="opacity-60" />
              <div className="flex justify-between items-center text-sm">
                <p className="text-[#64748B]">Frais de livraison</p>
                <p className="text-[#0F172A] font-bold">
                  {FactureData?.requiresDelivery ? `${FactureData?.deliveryfees || 0} DH` : "0 DH"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="my-4">
          <h3 className="flex items-center gap-2 text-[#64748B] text-sm mb-2">
            <Package color="#0050CB" size={14} /> DÉTAILS DES PRODUITS
          </h3>
          <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[#64748B] font-medium text-[12px]">
                  <th className="py-2.5 px-4">Produit</th>
                  <th className="py-2.5 px-4 text-center">Qté</th>
                  <th className="py-2.5 px-4 text-right">Prix Unit.</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {FactureData?.items?.map((item, index) => {
                  const qty = Number(item.quantity || 0);
                  const priceVal = Number(item.buyingPrice || item.sellingPrice || 0);
                  const itemTotal = qty * priceVal;
                  return (
                    <tr key={index} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        {getProductName(item.product)}
                      </td>
                      <td className="py-2.5 px-4 text-center font-semibold text-slate-600">
                        {qty}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-600">
                        {priceVal} DH
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                        {itemTotal} DH
                      </td>
                    </tr>
                  );
                })}
                {(!FactureData?.items || FactureData.items.length === 0) && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-400 text-xs">
                      Aucun produit trouvé pour cette vente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial & Payment Summary */}
        <div className="bg-[#0F172A] px-6 py-5 rounded-xl text-white space-y-4 shadow-md">
          <div>
            <h3 className="text-[#94A3B8] text-[11px] font-bold tracking-wider mb-3">RÉSUMÉ FINANCIER</h3>
            <div className="flex gap-2 flex-col text-sm">
              <div className="flex justify-between items-center">
                <p className="text-[#94A3B8]">Sous-total</p>
                <p className="font-semibold">{FactureData?.subtotal || 0} DH</p>
              </div>
              {FactureData?.discount > 0 && (
                <div className="flex justify-between items-center">
                  <p className="text-[#94A3B8]">Remise</p>
                  <p className="font-semibold text-red-400">-{FactureData.discount} DH</p>
                </div>
              )}
              {FactureData?.requiresDelivery && (
                <div className="flex justify-between items-center">
                  <p className="text-[#94A3B8]">Livraison</p>
                  <p className="font-semibold">+{FactureData.deliveryfees || 0} DH</p>
                </div>
              )}
              <div className="border-t border-[#334155] my-1"></div>
              <div className="flex justify-between items-center text-base font-bold">
                <p>Montant Total</p>
                <p className="text-[#38BDF8]">{FactureData?.totalAmount || 0} DH</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#334155] pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-[#94A3B8] text-[11px] font-bold tracking-wider block mb-1">MÉTHODE</span>
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  {getPaymentMethodDetails(FactureData?.paymentMethod).icon}
                  <span className="text-sm">{getPaymentMethodDetails(FactureData?.paymentMethod).label}</span>
                </div>
              </div>
              <div>
                <span className="text-[#94A3B8] text-[11px] font-bold tracking-wider block mb-1">PAYÉ</span>
                <span className="font-bold text-[#10B981] text-base">{FactureData?.paidAmount || 0} DH</span>
              </div>
              <div>
                <span className="text-[#94A3B8] text-[11px] font-bold tracking-wider block mb-1">RESTE</span>
                <span className={`font-bold text-base ${FactureData?.remainAmount > 0 ? "text-red-400" : "text-white"}`}>
                  {FactureData?.remainAmount || 0} DH
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <Divider />
      <DialogActions className="bg-[#F8FAFC] px-6 py-4 flex gap-3">
        <button
          onClick={handleClose}
          className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-100 text-slate-700 bg-white font-medium px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 shadow-sm w-full sm:w-auto text-sm"
        >
          <X size={15} />
          Fermer
        </button>
        <button
          onClick={() => {
            console.log("Printing invoice:", FactureData?.invoiceNumber);
            window.print();
          }}
          className="flex items-center justify-center gap-2 bg-[#0050CB] hover:bg-[#0040A3] text-white font-semibold px-6 py-2.5 rounded-lg cursor-pointer transition-all duration-200 shadow-md flex-1 text-sm"
        >
          <Printer size={15} />
          Imprimer la Facture
        </button>
      </DialogActions>
    </Dialog>
  );
}
