import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { X, Receipt, User, Package, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeliveryDetailsModal({ open, onClose, delivery }) {
  if (!delivery) return null;

  const sale = delivery.sale || {};
  const items = sale.items || [];
  const address = delivery.deliveryAddress || {};

  const paymentStatusStyles = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    partial: "bg-amber-50 text-amber-700 border-amber-200",
    unpaid: "bg-red-50 text-red-700 border-red-200",
  };

  const paymentStatusLabels = {
    paid: "Payé",
    partial: "Partiel",
    unpaid: "Non payé",
  };

  const formattedPaymentStatus = paymentStatusLabels[sale.paymentStatus] || sale.paymentStatus || "N/A";
  const paymentBadgeStyle = paymentStatusStyles[sale.paymentStatus] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      slotProps={{ paper: { className: "rounded-2xl overflow-hidden" } }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Détails de la Livraison
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Facture : <span className="font-semibold text-blue-600">{sale.invoiceNumber || "N/A"}</span>
            </p>
          </div>
        </div>
        <IconButton
          onClick={onClose}
          size="small"
          className="!text-slate-400 hover:!bg-slate-200/60 hover:!text-slate-700"
        >
          <X className="h-5 w-5" />
        </IconButton>
      </div>

      <DialogContent className="max-h-[75vh] space-y-6 p-6">
        {/* Client & Address Info Header Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Client Box */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <User className="h-4 w-4 text-blue-600" />
              Informations Client
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {sale.customerName || sale.customer?.name || "Client non spécifié"}
              </p>
              {address.phone && (
                <p className="text-xs text-slate-500 mt-1">
                  Téléphone : <span className="font-medium text-slate-700">{address.phone}</span>
                </p>
              )}
            </div>
          </div>

          {/* Delivery Address Box */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Adresse de livraison
            </div>
            <div className="text-sm text-slate-700">
              <p className="font-semibold text-slate-800">{address.city || "Ville non spécifiée"}</p>
              {address.street && <p className="text-xs text-slate-500">{address.street}</p>}
              {address.notes && (
                <p className="text-xs text-amber-600 italic mt-1 bg-amber-50 p-1.5 rounded border border-amber-100">
                  Note : {address.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
            <Package className="h-4 w-4 text-amber-500" />
            Articles de la commande ({items.length})
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/80 text-xs font-semibold uppercase text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Produit</th>
                  <th className="px-4 py-3 text-center">Quantité</th>
                  <th className="px-4 py-3 text-right">Prix Unitaire</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-slate-400 italic">
                      Aucun article listé
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => {
                    const itemName =
                      (typeof item.product === "object" && item.product?.name) ||
                      item.name ||
                      item.productName ||
                      `Article #${idx + 1}`;
                    const qty = item.quantity || 1;
                    const price = item.sellingPrice ?? item.unitPrice ?? item.price ?? 0;
                    const total = item.itemTotal ?? item.total ?? qty * price;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {itemName}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-slate-700">
                          {qty}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600">
                          {Number(price).toFixed(2)} DH
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                          {Number(total).toFixed(2)} DH
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200 pt-4">
          {/* Total Amount */}
          <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/80 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">Montant Total</span>
            <span className="text-lg font-bold text-slate-900 mt-1">
              {sale.totalAmount !== undefined ? `${Number(sale.totalAmount).toFixed(2)} DH` : "0.00 DH"}
            </span>
          </div>

          {/* Payment Status */}
          <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/80 flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">Statut de Paiement</span>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${paymentBadgeStyle}`}>
                {formattedPaymentStatus}
              </span>
            </div>
          </div>

          {/* Payment in Delivery */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 flex flex-col justify-between">
            <span className="text-xs font-medium text-blue-700 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              Paiement à la Livraison
            </span>
            <span className="text-lg font-bold text-blue-900 mt-1">
              {sale.payementInlivrisan !== undefined
                ? `${Number(sale.payementInlivrisan).toFixed(2)} DH`
                : sale.paymentInDelivery !== undefined
                ? `${Number(sale.paymentInDelivery).toFixed(2)} DH`
                : "0.00 DH"}
            </span>
          </div>
        </div>
      </DialogContent>

      <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-3 flex justify-end">
        <Button
          type="button"
          onClick={onClose}
          className="bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
        >
          Fermer
        </Button>
      </div>
    </Dialog>
  );
}
