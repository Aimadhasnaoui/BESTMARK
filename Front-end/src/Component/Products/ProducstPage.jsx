import React from "react";
import { useState, useMemo } from "react";
import HeaderPage from "../UI/HeaderPage";
import { useQuery } from "@tanstack/react-query";
import { GetProducts, GetLowStockProducts } from "@/Servises/Products";
import { DataTable } from "../UI/TablesUi/DataTable";
import { ActionButtons } from "../UI/TablesUi/ActionButtons";
import { Package } from "lucide-react";
import ProductsStatic from "./ProductsStatic";
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import Delete from "./Actions/Delete";
import ProductTable from "./ProductTable";
export default function ProducstPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [supplierFilter, setSupplierFilter] = useState(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["products", categoryFilter?._id, supplierFilter?._id],
    queryFn: () => GetProducts({ category: categoryFilter?._id, supplier: supplierFilter?._id }),
  });

  const { data: lowStockData, isPending: isLowStockPending } = useQuery({
    queryKey: ["products", "low-stock"],
    queryFn: GetLowStockProducts,
    enabled: activeFilter === "low-stock",
  });

  const tableData = useMemo(() => {
    if (activeFilter === "low-stock") return lowStockData?.products || [];
    if (activeFilter === "out-of-stock") return (data?.products || []).filter((p) => p.quantity === 0);
    if (activeFilter === "has-sales") return (data?.products || []).filter((p) => p.Number_of_sales > 0);
    return data?.products || [];
  }, [activeFilter, data, lowStockData]);

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setIsUpdating(true);
  };
  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleting(true);
  };

  return (
    <div className="">
      <HeaderPage
        title="Gestion des produits"
        description="Créer, modifier et supprimer les produits de vos produits"
        isAjouter={true}
        ButtonText="Ajouter un produit"
        onButtonClick={() => setIsAdding(true)}
      />
      <ProductsStatic data={data} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <ProductTable
        data={tableData}
        isError={isError}
        error={error}
        isLoading={isPending || (activeFilter === "low-stock" && isLowStockPending)}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        currentFilters={{ category: categoryFilter, supplier: supplierFilter }}
        onApplyFilters={(f) => {
          setCategoryFilter(f.category || null);
          setSupplierFilter(f.supplier || null);
        }}
      />

      {/* Action Modals */}
      {isAdding && <Add isAdding={isAdding} setIsAdding={setIsAdding} />}
      {isUpdating && (
        <Update
          isUpdating={isUpdating}
          setIsUpdating={setIsUpdating}
          selectedProduct={selectedProduct}
        />
      )}
      {isDeleting && (
        <Delete
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
          selectedProduct={selectedProduct}
        />
      )}
    </div>
  );
}
