import React, { useMemo } from "react";
import { DataTable } from "../UI/TablesUi/DataTable";
import { ActionButtons } from "../UI/TablesUi/ActionButtons";
import { 
  Calendar, 
  Truck, 
  DollarSign, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Banknote
} from "lucide-react";


export default function PurchaseTable({
  data = [],
  isLoading,
  isError,
  ErrorMessage = 'Erreur lors de la récupération des achats',
  onDelete,
  onEdit,
}) {
  const columns = useMemo(
    () => [
      {
        header: () => (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>DATE</span>
          </div>
        ),
        accessorKey: "purchaseDate",
        cell: ({ row }) => {
          const date = new Date(row.original.purchaseDate);
          return (
            <div className="flex flex-col">
              <span className="font-medium text-slate-700">
                {date.toLocaleDateString("fr-FR", { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="text-xs text-slate-500">
                {date.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        },
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span>FOURNISSEUR</span>
          </div>
        ),
        accessorKey: "supplier.name",
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
            {row.original.supplier?.name || "N/A"}
          </span>
        ),
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>TOTAL</span>
          </div>
        ),
        accessorKey: "totalAmount",
        cell: ({ row }) => (
          <span className="font-bold text-slate-800">
            {row.original.totalAmount.toLocaleString()} <span className="text-[0.7rem] text-slate-500 font-medium">DH</span>
          </span>
        ),
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4" />
            <span>PAYÉ</span>
          </div>
        ),
        accessorKey: "paidAmount",
        cell: ({ row }) => (
          <span className="font-semibold text-emerald-600">
            {row.original.paidAmount.toLocaleString()} <span className="text-[0.6rem] text-emerald-400">DH</span>
          </span>
        ),
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>DETTES</span>
          </div>
        ),
        accessorKey: "debts",
        cell: ({ row }) => (
          <span className={`font-semibold ${row.original.debts > 0 ? 'text-red-500' : 'text-slate-400'}`}>
            {row.original.debts.toLocaleString()} <span className="text-[0.6rem]">DH</span>
          </span>
        ),
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>STATUT</span>
          </div>
        ),
        accessorKey: "paymentStatus",
        cell: ({ row }) => {
          const status = row.original.paymentStatus;
          const styles = {
            paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
            partial: "bg-amber-50 text-amber-700 border-amber-100",
            unpaid: "bg-red-50 text-red-700 border-red-100",
          };
          const labels = {
            paid: "Payé",
            partial: "Partiel",
            unpaid: "Non payé",
          };
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${styles[status]}`}>
              {labels[status]}
            </span>
          );
        },
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span>MÉTHODE</span>
          </div>
        ),
        accessorKey: "paymentMethod",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-slate-600 capitalize">
            {row.original.paymentMethod}
          </span>
        ),
      },
      {
        header: "ACTIONS",
        accessorKey: "actions",
        cell: ({ row }) => (
          <ActionButtons
            onEdit={() => onEdit(row.original)}
            onDelete={() => onDelete(row.original)}
          />
        ),
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isError={isError}
      ErrorMessage={ErrorMessage}
      TableTitle="Achats"
      isAjouter={false} // Header button is handled in PurchasePage
    />
  );
}
