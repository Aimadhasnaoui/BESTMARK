import React, { useMemo } from "react";
import { DataTable } from "../UI/TablesUi/DataTable";
import { ActionButtons } from "../UI/TablesUi/ActionButtons";
import { 
  FileText, 
  User, 
  CreditCard, 
  Truck, 
  Calendar,
  DollarSign
} from "lucide-react";

export default function SalesTable({
  data = [],
  isLoading,
  isError,
  ErrorMessage = 'Erreur lors de la récupération des ventes',
  onDelete,
  onSee
}) {
  const columns = useMemo(
    () => [
      {
        header: () => (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>FACTURE</span>
          </div>
        ),
        accessorKey: "invoiceNumber",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg shadow-sm">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800">{row.original.invoiceNumber}</span>
          </div>
        ),
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>SERVI PAR</span>
          </div>
        ),
        accessorKey: "servedBy.name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-lg shadow-sm">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-slate-600">{row.original.servedBy?.name || "N/A"}</span>
          </div>
        ),
      },
      {
        id: "payment_summary",
        header: () => (
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span>PAIEMENT (Total | Payé | Reste)</span>
          </div>
        ),
        cell: ({ row }) => {
          const { totalAmount, paidAmount, remainAmount } = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg shadow-sm">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400 w-12">Total:</span>
                  <span className="font-bold text-slate-800">{totalAmount?.toLocaleString()} DH</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400 w-12">Payé:</span>
                  <span className="font-bold text-emerald-600">{paidAmount?.toLocaleString()} DH</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400 w-12">Reste:</span>
                  <span className={`font-bold ${remainAmount > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                    {remainAmount?.toLocaleString()} DH
                  </span>
                </div>
              </div>
            </div>
          );
        }
      },
      {
        header: "CLIENT",
        accessorKey: "customerName",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-700">{row.original.customerName || "Client Comptant"}</span>
            <span className="text-xs text-slate-400">{row.original.customerPhone}</span>
          </div>
        ),
      },
      {
        id: "delivery_info",
        header: () => (
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span>LIVRAISON</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg shadow-sm ${row.original.requiresDelivery ? 'bg-amber-500' : 'bg-slate-200'}`}>
                <Truck className="w-4 h-4 text-white" />
              </div>
            {row.original.requiresDelivery ? (
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                  Oui
                </span>
                <span className="text-[10px] text-slate-500 font-mono">ID: {row.original.deliveryId?._id || row.original.deliveryId}</span>
              </div>
            ) : (
              <span className="text-xs text-slate-300">Non</span>
            )}
          </div>
        )
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>DATE</span>
          </div>
        ),
        accessorKey: "saleDate",
        cell: ({ row }) => (
          <span className="text-sm text-slate-500">
            {new Date(row.original.saleDate).toLocaleDateString('fr-FR')}
          </span>
        ),
      },
      {
        header: "ACTIONS",
        accessorKey: "actions",
        cell: ({ row }) => (
          <ActionButtons
            onSee={() => onSee(row.original)}
            onDelete={() => onDelete(row.original)}
            isSee={true}
          />
        ),
      },
    ],
    [onDelete, onSee]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isError={isError}
      ErrorMessage={ErrorMessage}
      TableTitle="Ventes"
      isAjouter={false}
    />
  );
}
