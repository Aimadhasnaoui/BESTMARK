import React, { useState } from 'react';
import HeaderPage from '../UI/HeaderPage';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetSales, DeleteSale } from '@/Servises/Sales';
import SalesTable from './SalesTable';
import DeletModel from '../UI/Models/DeletModel';
import { toast } from "react-hot-toast";

export default function SalesPage() {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['sales'],
    queryFn: GetSales,
  });

  const { mutate: deleteMutate, isPending: isDeletePending } = useMutation({
    mutationFn: (id) => DeleteSale(id),
    onSuccess: () => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success("Vente supprimée avec succès");
    }
  });

  const handleDeleteClick = (sale) => {
    setSelectedSale(sale);
    setIsDeleting(true);
  };

  return (
    <div className=''>
      <HeaderPage 
        title="Historique des Ventes"
        description="Consultez l'historique complet des ventes, les paiements et les livraisons associées."
        isAjouter={false}
      />
      
      <SalesTable
        data={data?.sales || []}
        isError={isError}
        error={error}
        isLoading={isPending}
        onDelete={handleDeleteClick}
        onSee={(sale) => console.log("See sale", sale)}
      />

      <DeletModel
        open={isDeleting}
        setIsOpen={setIsDeleting}
        handelDelet={() => deleteMutate(selectedSale._id)}
        isPending={isDeletePending}
        title="Supprimer la vente ?"
        itemName={selectedSale?.invoiceNumber}
        DeleteMsg="Êtes-vous sûr de vouloir supprimer cette vente ? Cette action peut impacter vos rapports financiers."
      />
    </div>
  );
}
