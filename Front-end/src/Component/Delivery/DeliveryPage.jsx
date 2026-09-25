import React, { useState, useEffect, useMemo } from 'react';
import HeaderPage from '../UI/HeaderPage';
import { useQuery } from "@tanstack/react-query";
import { GetDeliverys } from '@/Servises/Delivery';
import DeliveryTable from './DeliveryTable';
import DeliveryFilters from './DeliveryFilters';
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import Delete from "./Actions/Delete";
import { useModelPermissions } from "@/hooks/usePermissions";

const isLateDelivery = (delivery) => {
  if (!delivery.estimatedArrival) return false;
  if (delivery.status === "arrived" || delivery.status === "failed") return false;
  return new Date(delivery.estimatedArrival) < new Date();
};

export default function DeliveryPage() {
  const { canAdd, canEdit, canDelete } = useModelPermissions("Livraisons");
  // A livreur has "Gestion des Livraisons" but NOT the full "Livraisons" access.
  // The back-end already filters their data; we just adapt the UI accordingly.
  const { canView: isLivreurView } = useModelPermissions("Gestion des Livraisons");
  const isLivreur = isLivreurView && !canAdd;
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const [statusFilter, setStatusFilter] = useState(isLivreur ? "pending" : "");
  const [deliveryManFilter, setDeliveryManFilter] = useState(null);

  useEffect(() => {
    if (isLivreur) {
      setStatusFilter("pending");
    }
  }, [isLivreur]);

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
    setStatusFilter(isLivreur ? "pending" : "");
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
        description={isLivreur ? "Vos livraisons assignées." : "Suivez l'état des livraisons, gérez les livreurs et les délais d'arrivée."}
        isAjouter={canAdd}
        ButtonText="Planifier une livraison"
        onButtonClick={() => setIsAdding(true)}
      />

      {/* The livreur only sees their own deliveries (filtered server-side), so
          hiding the deliveryMan filter avoids a useless single-option dropdown. */}
      <DeliveryFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        deliveryManFilter={deliveryManFilter}
        setDeliveryManFilter={setDeliveryManFilter}
        deliveryManOptions={isLivreur ? [] : deliveryManOptions}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        isLivreur={isLivreur}
      />

      <DeliveryTable
        data={filteredDeliveries}
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
