import React, { useState } from "react";
import HeaderPage from "../UI/HeaderPage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetSales, DeleteSale } from "@/Servises/Sales";
import SalesTable from "./SalesTable";
import DeletModel from "../UI/Models/DeletModel";
import { toast } from "react-hot-toast";
import SellFacture from "./Actions/SellFacture";
import EditSale from "./Actions/EditSale";

export default function SalesPage() {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  
  const [openFactue, setopenFactue] = useState(false);
  const [FactureData, setFactureData] = useState({});

  const [isEditingSale, setIsEditingSale] = useState(false);
  const [editingSale, setEditingSale] = useState(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["sales"],
    queryFn: GetSales,
  });

  const { mutate: deleteMutate, isPending: isDeletePending } = useMutation({
    mutationFn: (id) => DeleteSale(id),
    onSuccess: () => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast.success("Vente supprimée avec succès");
    },
  });

  function handsefunction(item) {
    console.log(item);
    setFactureData(item);
    setopenFactue(true);
  }

  const handleDeleteClick = (sale) => {
    setSelectedSale(sale);
    setIsDeleting(true);
  };

  const handleEditClick = (sale) => {
    setEditingSale(sale);
    setIsEditingSale(true);
  };

  return (
    <div className="">
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
        onSee={handsefunction}
        onEdit={handleEditClick}
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

      <SellFacture
        openFactue={openFactue}
        setopenFactue={setopenFactue}
        FactureData={FactureData}
      />

      <EditSale
        open={isEditingSale}
        setIsOpen={setIsEditingSale}
        saleData={editingSale}
      />
    </div>
  );
}
