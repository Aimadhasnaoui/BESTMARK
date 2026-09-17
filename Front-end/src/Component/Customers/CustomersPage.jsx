import React, { useState } from "react";
import HeaderPage from "../UI/HeaderPage";
import { useQuery } from "@tanstack/react-query";
import { GetCustomers } from "@/Servises/Customers";
import CustomersTable from "./CustomersTable";
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import Delete from "./Actions/Delete";
import { useModelPermissions } from "@/hooks/usePermissions";

export default function CustomersPage() {
  const { canAdd, canEdit, canDelete } = useModelPermissions("Demandes clients");
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["customers"],
    queryFn: () => GetCustomers(),
  });

  const handleUpdate = (customer) => {
    setSelectedCustomer(customer);
    setIsUpdating(true);
  };

  const handleDelete = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleting(true);
  };

  return (
    <div className="">
      <HeaderPage
        title="Demandes Clients"
        description="Gérez les demandes de produits spécifiques de vos clients"
        isAjouter={canAdd}
        ButtonText="Ajouter une demande"
        onButtonClick={() => setIsAdding(true)}
      />

      <CustomersTable
        data={data?.customerRequests || []}
        isError={isError}
        error={error}
        isLoading={isPending}
        onEdit={canEdit ? handleUpdate : undefined}
        onDelete={canDelete ? handleDelete : undefined}
      />

      {/* Action Modals */}
      <Add isAdding={isAdding} setIsAdding={setIsAdding} />
      <Update
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        selectedCustomer={selectedCustomer}
      />
      <Delete
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
        selectedCustomer={selectedCustomer}
      />
    </div>
  );
}
