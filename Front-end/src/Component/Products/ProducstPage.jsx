import React from 'react'
import { useState,useMemo } from 'react'
import HeaderPage from '../UI/HeaderPage'
import { useQuery } from "@tanstack/react-query";
import { GetProducts } from '@/Servises/Products'
import { DataTable } from '../UI/TablesUi/DataTable'
import { ActionButtons } from '../UI/TablesUi/ActionButtons'
import { Package } from 'lucide-react'
import ProductsStatic from './ProductsStatic'
import Add from "./Actions/Add";
import Update from "./Actions/Update";
import Delete from "./Actions/Delete";
import  ProductTable  from './ProductTable'
export default function ProducstPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {data,isPending,isError,error} = useQuery({
    queryKey:['products'],
    queryFn:()=>GetProducts(),
  })
  const mockData = [
  {
    _id: "1",
    name: "Casque Audio Premium",
    description: "Casque sans fil avec réduction de bruit active.",
    barcode: "123456789",
    buyingPrice: 450,
    sellingPrice: 899,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
    category: { name: "Électronique" },
    quantity: 15,
    supplier: { name: "Sony Corp" },
    minStockAlert: 5,
    Number_of_sales: 120
  },
  // ...
]

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setIsUpdating(true);
  };
  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleting(true);
  };

  return (
    <div className=''>
      <HeaderPage 
        title="Gestion des produits"
        description="Créer, modifier et supprimer les produits de vos produits"
        isAjouter={true}
        ButtonText="Ajouter un produit"
        onButtonClick={() => setIsAdding(true)}
      />
      <ProductsStatic data={data} />
      <ProductTable
        data={data?.products || mockData}
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
        selectedProduct={selectedProduct}
      />
      <Delete
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
        selectedProduct={selectedProduct}
      />
    </div>
  )
}
