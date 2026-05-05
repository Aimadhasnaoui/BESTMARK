import React, { useMemo } from "react";
import { DataTable } from "../UI/TablesUi/DataTable";
import { ActionButtons } from "../UI/TablesUi/ActionButtons";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Package, Calendar, Tag } from "lucide-react";

export default function CustomersTable({
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
        accessorKey: "customerName",
        header: "Client",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-full">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">
              {row.getValue("customerName")}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "customerPhone",
        header: "Téléphone",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-3.5 h-3.5" />
            {row.getValue("customerPhone")}
          </div>
        ),
      },
      {
        accessorKey: "product",
        header: "Produit Demandé",
        cell: ({ row }) => {
          const product = row.getValue("product");
          return (
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">
                {product?.name || "N/A"}
              </span>
              <span className="text-xs text-gray-500">
                {product?.barcode || "Pas de code-barres"}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "quantity",
        header: "Quantité",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 font-medium">
            <Tag className="w-3.5 h-3.5 text-gray-400" />
            {row.getValue("quantity")}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => {
          const status = row.getValue("status");
          const statusStyles = {
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            notified: "bg-blue-100 text-blue-700 border-blue-200",
            fulfilled: "bg-emerald-100 text-emerald-700 border-emerald-200",
            cancelled: "bg-rose-100 text-rose-700 border-rose-200",
          };

          const statusLabels = {
            pending: "En attente",
            notified: "Notifié",
            fulfilled: "Terminé",
            cancelled: "Annulé",
          };

          return (
            <Badge
              variant="outline"
              className={`${statusStyles[status]} capitalize px-2.5 py-0.5 rounded-full text-[11px] font-bold`}
            >
              {statusLabels[status] || status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Date de demande",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(row.getValue("createdAt")).toLocaleDateString("fr-FR")}
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
      data={data}
      columns={columns}
      isLoading={isLoading}
      isError={isError}
      ErrorMessage={error?.message || "Erreur lors du chargement des demandes clients"}
      TableTitle="Demandes Clients"
      isAjouter={false}
    />
  );
}
