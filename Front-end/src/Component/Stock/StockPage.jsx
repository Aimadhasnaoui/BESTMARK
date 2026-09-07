import React, { useState, useMemo } from 'react';
import HeaderPage from '../UI/HeaderPage';
import { useQuery } from "@tanstack/react-query";
import { GetStockMovements } from '@/Servises/StockMovements';
import StockTable from './StockTable';
import StockFilters from './StockFilters';
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import Delete from "./Actions/Delete";

export default function StockPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);

  const [typeFilter, setTypeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [userFilter, setUserFilter] = useState(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['stockMovements'],
    queryFn: GetStockMovements,
  });

  const userOptions = useMemo(() => {
    const map = new Map();
    (data?.stockMovements || []).forEach((movement) => {
      if (movement.createdBy?._id) map.set(movement.createdBy._id, movement.createdBy);
    });
    return Array.from(map.values());
  }, [data]);

  const filteredMovements = useMemo(() => {
    return (data?.stockMovements || []).filter((movement) => {
      if (typeFilter && movement.type !== typeFilter) return false;
      if (userFilter && movement.createdBy?._id !== userFilter._id) return false;
      if (dateFrom && new Date(movement.createdAt) < new Date(dateFrom)) return false;
      if (dateTo) {
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (new Date(movement.createdAt) > endOfDay) return false;
      }
      return true;
    });
  }, [data, typeFilter, userFilter, dateFrom, dateTo]);

  const hasActiveFilters = !!(typeFilter || userFilter || dateFrom || dateTo);

  const resetFilters = () => {
    setTypeFilter("");
    setDateFrom("");
    setDateTo("");
    setUserFilter(null);
  };

  const handleUpdate = (movement) => {
    setSelectedMovement(movement);
    setIsUpdating(true);
  };

  const handleDelete = (movement) => {
    setSelectedMovement(movement);
    setIsDeleting(true);
  };

  return (
    <div className=''>
      <HeaderPage 
        title="Gestion de Stock"
        description="Suivez les mouvements de stock, les ajustements et l'historique des produits."
        isAjouter={true}
        ButtonText="Nouveau Mouvement"
        onButtonClick={() => setIsAdding(true)}
      />
      
      <StockFilters
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        userFilter={userFilter}
        setUserFilter={setUserFilter}
        userOptions={userOptions}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <StockTable
        data={filteredMovements}
        isError={isError}
        error={error}
        isLoading={isPending}
        onEdit={handleUpdate}
        onDelete={handleDelete}
      />

      {/* Action Modals */}
      <Add isAdding={isAdding} setIsAdding={setIsAdding} />
      {
        isUpdating && (
      <Update
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        selectedMovement={selectedMovement}
      />
        )
      }
      {
        isDeleting && (
          <Delete
            isDeleting={isDeleting}
            setIsDeleting={setIsDeleting}
            selectedMovement={selectedMovement}
          />
        )
      }
    </div>
  );
}
