import React, { useState, useMemo } from 'react';
import HeaderPage from '../UI/HeaderPage';
import { useQuery } from "@tanstack/react-query";
import { GetDeliverys } from '@/Servises/Delivery';
import DeliveryTable from './DeliveryTable';
import DeliveryFilters from './DeliveryFilters';
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import Delete from "./Actions/Delete";

const isLateDelivery = (delivery) => {
  if (!delivery.estimatedArrival) return false;
  if (delivery.status === "arrived" || delivery.status === "failed") return false;
  return new Date(delivery.estimatedArrival) < new Date();
};

export default function DeliveryPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [deliveryManFilter, setDeliveryManFilter] = useState(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['deliveries'],
    queryFn: GetDeliverys,
  });

  const deliveryManOptions = useMemo(() => {
    const map = new Map();
    (data?.deliveries || []).forEach((delivery) => {
      if (delivery.deliveryMan?._id) map.set(delivery.deliveryMan._id, delivery.deliveryMan);
    });
    return Array.from(map.values());
  }, [data]);

  const filteredDeliveries = useMemo(() => {
    return (data?.deliveries || []).filter((delivery) => {
      if (statusFilter === "late") {
        if (!isLateDelivery(delivery)) return false;
      } else if (statusFilter && delivery.status !== statusFilter) {
        return false;
      }
      if (deliveryManFilter && delivery.deliveryMan?._id !== deliveryManFilter._id) return false;
      return true;
    });
  }, [data, statusFilter, deliveryManFilter]);

  const hasActiveFilters = !!(statusFilter || deliveryManFilter);

  const resetFilters = () => {
    setStatusFilter("");
    setDeliveryManFilter(null);
  };

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
      
      <DeliveryFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        deliveryManFilter={deliveryManFilter}
        setDeliveryManFilter={setDeliveryManFilter}
        deliveryManOptions={deliveryManOptions}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <DeliveryTable
        data={filteredDeliveries}
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
