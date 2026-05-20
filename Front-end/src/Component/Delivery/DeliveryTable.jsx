import React, { useMemo } from "react";
import { DataTable } from "../UI/TablesUi/DataTable";
import { ActionButtons } from "../UI/TablesUi/ActionButtons";
import {
  Truck,
  User,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Timer,
} from "lucide-react";

export default function DeliveryTable({
  data = [],
  isLoading,
  isError,
  ErrorMessage = "Erreur lors de la récupération des livraisons",
  onDelete,
  onEdit,
}) {
  const columns = useMemo(
    () => [
      {
        header: () => (
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-white" />
            <span>LIVRAISON</span>
          </div>
        ),
        accessorKey: "sale.invoiceNumber",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800">
                {row.original.sale?.invoiceNumber || "N/A"}
              </span>
            </div>
          </div>
        ),
      },
      {
        header: "STATUT",
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row.original.status;
          const styles = {
            pending: "bg-slate-100 text-slate-700 border-slate-200",
            preparing: "bg-blue-50 text-blue-700 border-blue-100",
            on_route: "bg-amber-50 text-amber-700 border-amber-100",
            arrived: "bg-emerald-50 text-emerald-700 border-emerald-100",
            failed: "bg-red-50 text-red-700 border-red-100",
          };
          const labels = {
            pending: "En attente",
            preparing: "Préparation",
            on_route: "En route",
            arrived: "Livré",
            failed: "Échoué",
          };
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${styles[status]}`}
            >
              {labels[status]}
            </span>
          );
        },
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-white" />
            <span>LIVREUR</span>
          </div>
        ),
        accessorKey: "deliveryMan.name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">

            <span className="text-sm font-medium text-slate-600">
              {row.original.deliveryMan?.name || "Non assigné"}
            </span>
          </div>
        ),
      },
      {
        id: "address_info",
        header: () => (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-white" />
            <span>ADRESSE</span>
          </div>
        ),
        cell: ({ row }) => {
          const addr = row.original.deliveryAddress;
          return (
            <div className="flex items-center gap-3">
              <div className="flex flex-col max-w-[200px]">
                <span className="text-sm font-semibold text-slate-700 truncate">
                  {addr?.city}
                </span>
                <span className="text-xs text-slate-500 truncate">
                  {addr?.street}
                </span>
                <span className="text-[10px] text-blue-500">{addr?.phone}</span>
              </div>
            </div>
          );
        },
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-white" />
            <span>ARRIVÉE PRÉVUE</span>
          </div>
        ),
        accessorKey: "estimatedArrival",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium">
                {row.original.estimatedArrival
                  ? new Date(row.original.estimatedArrival).toLocaleDateString(
                      "fr-FR",
                    )
                  : "-"}
              </span>
              <span className="text-[10px] text-slate-400">
                {row.original.estimatedArrival
                  ? new Date(row.original.estimatedArrival).toLocaleTimeString(
                      "fr-FR",
                      { hour: "2-digit", minute: "2-digit" },
                    )
                  : ""}
              </span>
            </div>
          </div>
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
    [onEdit, onDelete],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isError={isError}
      ErrorMessage={ErrorMessage}
      TableTitle="Livraisons"
      isAjouter={false}
    />
  );
}
