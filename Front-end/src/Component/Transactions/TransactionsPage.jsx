import React, { useState, useMemo } from "react";
import HeaderPage from "../UI/HeaderPage";
import { useQuery } from "@tanstack/react-query";
import { GetTransactions } from "@/Servises/Transactions";
import TransactionsTable from "./TransactionsTable";
import TransactionsFilters from "./TransactionsFilters";
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import Delete from "./Actions/Delete";

export default function TransactionsPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [directionFilter, setDirectionFilter] = useState("");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => GetTransactions(),
  });

  const filteredTransactions = useMemo(() => {
    return (data?.transactions || []).filter((transaction) => {
      if (typeFilter && transaction.type !== typeFilter) return false;
      if (directionFilter && transaction.direction !== directionFilter) return false;
      if (dateFrom && new Date(transaction.date) < new Date(dateFrom)) return false;
      if (dateTo) {
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (new Date(transaction.date) > endOfDay) return false;
      }
      return true;
    });
  }, [data, typeFilter, directionFilter, dateFrom, dateTo]);

  const hasActiveFilters = !!(typeFilter || directionFilter || dateFrom || dateTo);

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setTypeFilter("");
    setDirectionFilter("");
  };

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

      <TransactionsFilters
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        directionFilter={directionFilter}
        setDirectionFilter={setDirectionFilter}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <TransactionsTable
        data={filteredTransactions}
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
