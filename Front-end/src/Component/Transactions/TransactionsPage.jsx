import React, { useState } from "react";
import HeaderPage from "../UI/HeaderPage";
import { useQuery } from "@tanstack/react-query";
import { GetTransactions } from "@/Servises/Transactions";
import TransactionsTable from "./TransactionsTable";
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import Delete from "./Actions/Delete";

export default function TransactionsPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => GetTransactions(),
  });

  const handleUpdate = (transaction) => {
    setSelectedTransaction(transaction);
    setIsUpdating(true);
  };

  const handleDelete = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleting(true);
  };

  return (
    <div className="">
      <HeaderPage
        title="Transactions Financières"
        description="Consultez et gérez l'historique de vos entrées et sorties d'argent"
        isAjouter={true}
        ButtonText="Ajouter une transaction"
        onButtonClick={() => setIsAdding(true)}
      />

      <TransactionsTable
        data={data?.transactions || []}
        isError={isError}
        error={error}
        isLoading={isPending}
        onEdit={handleUpdate}
        onDelete={handleDelete}
      />

      {/* Action Modals */}
      <Add isAdding={isAdding} setIsAdding={setIsAdding} />
      <Update
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        selectedTransaction={selectedTransaction}
      />
      <Delete
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
        selectedTransaction={selectedTransaction}
      />
    </div>
  );
}
