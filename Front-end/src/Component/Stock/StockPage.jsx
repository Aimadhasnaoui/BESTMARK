import React, { useState } from 'react';
import HeaderPage from '../UI/HeaderPage';
import { useQuery } from "@tanstack/react-query";
import { GetStockMovements } from '@/Servises/StockMovements';
import StockTable from './StockTable';
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import Delete from "./Actions/Delete";

export default function StockPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['stockMovements'],
    queryFn: GetStockMovements,
  });

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
      
      <StockTable
        data={data?.movements || []}
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
        selectedMovement={selectedMovement}
      />
      <Delete
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
        selectedMovement={selectedMovement}
      />
    </div>
  );
}
