import React, { useContext, useState } from 'react';
import HeaderPage from '../UI/HeaderPage';
import { useQuery } from "@tanstack/react-query";
import { GetPurchases } from '@/Servises/Purchases';
import PurchaseTable from './PurchaseTable';
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import Delete from "./Actions/Delete";
import { DataContext } from '../Data/contextApi';

export default function PurchasePage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const {setOpenAddBuyerModal}  =useContext(DataContext)

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['purchases'],
    queryFn: GetPurchases,
  });

  const handleUpdate = (purchase) => {
    setSelectedPurchase(purchase);
    setIsUpdating(true);
  };

  const handleDelete = (purchase) => {
    setSelectedPurchase(purchase);
    setIsDeleting(true);
  };

  return (
    <div className=''>
      <HeaderPage 
        title="Gestion des Achats"
        description="Gérez les achats auprès de vos fournisseurs, suivez les paiements et les dettes."
        isAjouter={true}
        ButtonText="Ajouter un achat"
        onButtonClick={() => setOpenAddBuyerModal(true)}
      />
      
      <PurchaseTable
        data={data?.purchases || []}
        isError={isError}
        error={error}
        isLoading={isPending}
        onEdit={handleUpdate}
        onDelete={handleDelete}
      />

      {/* Action Modals */}
      <Update
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        selectedPurchase={selectedPurchase}
      />
      <Delete
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
        selectedPurchase={selectedPurchase}
      />
    </div>
  );
}
