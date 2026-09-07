import React, { useState, useMemo } from "react";
import HeaderPage from "../UI/HeaderPage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetSales, DeleteSale } from "@/Servises/Sales";
import SalesTable from "./SalesTable";
import SalesFilters from "./SalesFilters";
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

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [userFilter, setUserFilter] = useState(null);
  const [deliveryFilter, setDeliveryFilter] = useState("");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["sales"],
    queryFn: GetSales,
  });

  const userOptions = useMemo(() => {
    const map = new Map();
    (data?.sales || []).forEach((sale) => {
      if (sale.servedBy?._id) map.set(sale.servedBy._id, sale.servedBy);
    });
    return Array.from(map.values());
  }, [data]);

  const filteredSales = useMemo(() => {
    return (data?.sales || []).filter((sale) => {
      if (userFilter && sale.servedBy?._id !== userFilter._id) return false;
      if (deliveryFilter === "yes" && !sale.requiresDelivery) return false;
      if (deliveryFilter === "no" && sale.requiresDelivery) return false;
      if (dateFrom && new Date(sale.saleDate) < new Date(dateFrom)) return false;
      if (dateTo) {
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (new Date(sale.saleDate) > endOfDay) return false;
      }
      return true;
    });
  }, [data, userFilter, deliveryFilter, dateFrom, dateTo]);

  const hasActiveFilters = !!(userFilter || deliveryFilter || dateFrom || dateTo);

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setUserFilter(null);
    setDeliveryFilter("");
  };

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

      <SalesFilters
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        userFilter={userFilter}
        setUserFilter={setUserFilter}
        userOptions={userOptions}
        deliveryFilter={deliveryFilter}
        setDeliveryFilter={setDeliveryFilter}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <SalesTable
        data={filteredSales}
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
