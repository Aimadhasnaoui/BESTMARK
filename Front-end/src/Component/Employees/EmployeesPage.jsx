import React, { useState, useMemo } from "react";
import { DataTable } from "../UI/TablesUi/DataTable";
import { useQuery } from "@tanstack/react-query";
import { GetEmployees } from "@/Servises/Employees";
import { ActionButtons } from "../UI/TablesUi/ActionButtons";
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import Delete from "./Actions/Delete";

export default function EmployeesPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employees"],
    queryFn: GetEmployees,
  });

  const columns = useMemo(
    () => [
      {
        header: "Nom",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900">{row.original.name}</span>
            <span className="text-xs text-slate-500">{row.original.email || "Pas d'email"}</span>
          </div>
        )
      },
      {
        header: "Téléphone",
        accessorKey: "phone",
      },
      {
        header: "Mission",
        accessorKey: "mission.name",
        cell: ({ row }) => (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
            {row.original.mission?.name || "Non spécifié"}
          </span>
        )
      },
      {
        header: "Salaire",
        accessorKey: "salary",
        cell: ({ row }) => (
          <span className="font-bold text-slate-700">{row.original.salary} DH</span>
        )
      },
      {
        header: "Statut",
        accessorKey: "isActive",
        cell: ({ row }) => (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
            row.original.isActive 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
              : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {row.original.isActive ? "Actif" : "Inactif"}
          </span>
        )
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <ActionButtons
            onEdit={() => {
              setSelectedEmployee(row.original);
              setIsUpdating(true);
            }}
            onDelete={() => {
              setSelectedEmployee(row.original);
              setIsDeleting(true);
            }}
            onSee={() => {
              // Optional: Add view details logic if needed
            }}
          />
        ),
      },
    ],
    []
  );

  return (
    <div className="w-full">
      <DataTable
        data={data?.employees || []}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        ErrorMessage={error?.message}
        TableTitle="des employés"
        ButtonText="Ajouter un employé"
        onButtonClick={() => setIsAdding(true)}
      />

      {isAdding && (
        <Add isAdding={isAdding} setIsAdding={setIsAdding} />
      )}

      {isUpdating && (
        <Update
          isUpdating={isUpdating}
          setIsUpdating={setIsUpdating}
          selectedEmployee={selectedEmployee}
        />
      )}

      {isDeleting && (
        <Delete
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
          selectedEmployee={selectedEmployee}
        />
      )}
    </div>
  );
}
