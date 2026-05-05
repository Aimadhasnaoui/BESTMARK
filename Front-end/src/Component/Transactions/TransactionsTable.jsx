import React, { useMemo } from "react";
import { DataTable } from "../UI/TablesUi/DataTable";
import { ActionButtons } from "../UI/TablesUi/ActionButtons";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  Calendar, 
  FileText, 
  Tag 
} from "lucide-react";

export default function TransactionsTable({
  data = [],
  isLoading,
  isError,
  error,
  onEdit,
  onDelete,
}) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            {new Date(row.getValue("date")).toLocaleDateString("fr-FR")}
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.getValue("type");
          const typeStyles = {
            sale: "bg-emerald-50 text-emerald-700 border-emerald-100",
            expense: "bg-rose-50 text-rose-700 border-rose-100",
            purchase: "bg-blue-50 text-blue-700 border-blue-100",
          };
          const labels = {
            sale: "Vente",
            expense: "Dépense",
            purchase: "Achat",
          };
          return (
            <Badge variant="outline" className={`${typeStyles[type]} px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize`}>
              {labels[type] || type}
            </Badge>
          );
        },
      },
      {
        accessorKey: "direction",
        header: "Flux",
        cell: ({ row }) => {
          const direction = row.getValue("direction");
          return (
            <div className="flex items-center gap-1.5">
              {direction === "in" ? (
                <>
                  <ArrowUpCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-700 font-medium text-sm">Entrée</span>
                </>
              ) : (
                <>
                  <ArrowDownCircle className="w-4 h-4 text-rose-500" />
                  <span className="text-rose-700 font-medium text-sm">Sortie</span>
                </>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Montant",
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"));
          const direction = row.original.direction;
          return (
            <div className={`font-bold text-sm ${direction === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {direction === 'in' ? '+' : '-'} {amount.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}
            </div>
          );
        },
      },
      {
        accessorKey: "note",
        header: "Note",
        cell: ({ row }) => (
          <div className="flex items-start gap-2 text-gray-500 max-w-[250px] whitespace-normal break-words">
            <FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span className="text-xs leading-relaxed">{row.getValue("note")}</span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
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
      data={data.reverse()}
      columns={columns}
      isLoading={isLoading}
      isError={isError}
      ErrorMessage={error?.message || "Erreur lors du chargement des transactions"}
      TableTitle="Transactions Financières"
      isAjouter={false}
    />
  );
}
