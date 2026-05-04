import React, { useState } from 'react';
import HeaderPage from '../UI/HeaderPage';
import { useQuery } from "@tanstack/react-query";
import { GetDeliverys } from '@/Servises/Delivery';
import DeliveryTable from './DeliveryTable';
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import Delete from "./Actions/Delete";

export default function DeliveryPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['deliveries'],
    queryFn: GetDeliverys,
  });

  const handleUpdate = (delivery) => {
    setSelectedDelivery(delivery);
    setIsUpdating(true);
  };

  const handleDelete = (delivery) => {
    setSelectedDelivery(delivery);
    setIsDeleting(true);
  };

  return (
    <div className=''>
      <HeaderPage 
        title="Gestion des Livraisons"
        description="Suivez l'état des livraisons, gérez les livreurs et les délais d'arrivée."
        isAjouter={true}
        ButtonText="Planifier une livraison"
        onButtonClick={() => setIsAdding(true)}
      />
      
      <DeliveryTable
        data={data?.deliveries || []}
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
        selectedDelivery={selectedDelivery}
      />
      <Delete
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
        selectedDelivery={selectedDelivery}
      />
    </div>
  );
}
