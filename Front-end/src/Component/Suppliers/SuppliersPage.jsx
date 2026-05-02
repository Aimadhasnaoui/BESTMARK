import React, { useState, useMemo } from 'react'
import HeaderPage from '../UI/HeaderPage'
import { useQuery } from "@tanstack/react-query";
import { GetSuppliers } from '@/Servises/Suppliers'
import { DataTable } from '../UI/TablesUi/DataTable'
import { ActionButtons } from '../UI/TablesUi/ActionButtons'
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import Delete from "./Actions/Delete";

export default function SuppliersPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['suppliers'],
    queryFn: GetSuppliers,
  });

  const columns = useMemo(
    () => [
      {
        header: "Nom",
        accessorKey: "name",
      },
      {
        header: "Entreprise",
        accessorKey: "company",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Téléphone",
        accessorKey: "phone",
      },
      {
        header: "Adresse",
        accessorKey: "address",
      },
      {
        header: "Catégories",
        accessorKey: "productTypes",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {row.original.productTypes?.map((pt) => (
              <span 
                key={pt._id} 
                className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
              >
                {pt.name}
              </span>
            ))}
            {(!row.original.productTypes || row.original.productTypes.length === 0) && (
              <span className="text-muted-foreground text-xs italic">Aucune</span>
            )}
          </div>
        ),
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => (
          <ActionButtons
            onEdit={() => {
              setSelectedSupplier(row.original);
              setIsUpdating(true);
            }}
            onDelete={() => {
              setSelectedSupplier(row.original);
              setIsDeleting(true);
            }}
          />
        ),
      },
    ],
    []
  );

  return (
    <div className=''>
      <HeaderPage
        title="Gestion des fournisseurs"
        description="Gérez vos fournisseurs, leurs coordonnées et leurs entreprises"
        isAjouter={true}
        ButtonText="Ajouter un fournisseur"
        onButtonClick={() => setIsAdding(true)}
      />
      
      <DataTable
        data={data?.suppliers || []}
        columns={columns}
        isError={isError}
        error={error}
        isLoading={isPending}
        isAjouter={false}
      />

      {/* Action Modals */}
      <Add isAdding={isAdding} setIsAdding={setIsAdding} />
      <Update
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        selectedSupplier={selectedSupplier}
      />
      <Delete
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
        selectedSupplier={selectedSupplier}
      />
    </div>
  )
}
