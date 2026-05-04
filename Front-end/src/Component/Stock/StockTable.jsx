import React, { useMemo } from "react";
import { DataTable } from "../UI/TablesUi/DataTable";
import { ActionButtons } from "../UI/TablesUi/ActionButtons";
import { 
  Package, 
  ArrowRightLeft, 
  User, 
  TrendingUp, 
  TrendingDown, 
  ClipboardList,
  AlertCircle,
  FileText
} from "lucide-react";

export default function StockTable({
  data = [],
  isLoading,
  isError,
  ErrorMessage = 'Erreur lors de la récupération des mouvements de stock',
  onDelete,
  onEdit,
}) {
  const columns = useMemo(
    () => [
      {
        header: () => (
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>PRODUIT</span>
          </div>
        ),
        accessorKey: "product.name",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-bold text-slate-800">{row.original.product?.name || "N/A"}</span>
            <span className="text-xs text-slate-500">{row.original.product?.barcode}</span>
          </div>
        ),
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            <span>TYPE</span>
          </div>
        ),
        accessorKey: "type",
        cell: ({ row }) => {
          const type = row.original.type;
          const styles = {
            purchase: "bg-emerald-50 text-emerald-700 border-emerald-100",
            sale: "bg-blue-50 text-blue-700 border-blue-100",
            return: "bg-amber-50 text-amber-700 border-amber-100",
            adjustment: "bg-purple-50 text-purple-700 border-purple-100",
          };
          const labels = {
            purchase: "Achat",
            sale: "Vente",
            return: "Retour",
            adjustment: "Ajustement",
          };
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${styles[type]}`}>
              {labels[type]}
            </span>
          );
        },
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            <span>QUANTITÉ</span>
          </div>
        ),
        accessorKey: "quantity",
        cell: ({ row }) => {
          const qty = row.original.quantity;
          return (
            <div className="flex items-center gap-2">
              {qty > 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`font-bold ${qty > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {qty > 0 ? `+${qty}` : qty}
              </span>
            </div>
          );
        },
      },
      {
        header: "AVANT",
        accessorKey: "quantityBefore",
        cell: ({ row }) => (
          <span className="text-slate-500 font-medium">{row.original.quantityBefore}</span>
        ),
      },
      {
        header: "APRÈS",
        accessorKey: "quantityAfter",
        cell: ({ row }) => (
          <span className="text-slate-800 font-bold">{row.original.quantityAfter}</span>
        ),
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>PAR</span>
          </div>
        ),
        accessorKey: "createdBy.name",
        cell: ({ row }) => (
          <span className="text-sm text-slate-600">{row.original.createdBy?.name || "N/A"}</span>
        ),
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>NOTE</span>
          </div>
        ),
        accessorKey: "note",
        cell: ({ row }) => (
          <span className="text-xs text-slate-400 line-clamp-1 max-w-[150px]" title={row.original.note}>
            {row.original.note || "-"}
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
      TableTitle="Mouvements de Stock"
      isAjouter={false}
    />
  );
}
