import React from 'react'
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle,CardFooter } from "@/components/ui/card"
import { Package, AlertTriangle, AlertCircle, ShoppingCart } from "lucide-react"
import { GetLowStockProducts } from "@/Servises/Products"
import { cn } from "@/lib/utils"

export default function ProductsStatic({data, activeFilter = "all", onFilterChange}) {
  const { data: lowStockData } = useQuery({
    queryKey: ["products", "low-stock"],
    queryFn: GetLowStockProducts,
  });

  const cardBaseClass = "cursor-pointer transition-shadow hover:shadow-md";
  const isActive = (key) => activeFilter === key;
  const handleClick = (key) => {
    onFilterChange?.(isActive(key) ? "all" : key);
  };

  return (
   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-4">
      <Card
        size="sm"
        onClick={() => handleClick("all")}
        className={cn(cardBaseClass, isActive("all") && "ring-2 ring-[#10b981]")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#64748B] ">Total des produits</CardTitle>
          <div className='bg-[#10b981]/10 p-1.5 rounded-full'>
          <Package className="h-4 w-4 text-[#10b981]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{data?.products?.length || 0}</div>
          {/* <p className='text-xs text-[#059669] my-2'>12% from last month</p> */}
        </CardContent>
      </Card>
      <Card
        size="sm"
        onClick={() => handleClick("out-of-stock")}
        className={cn(cardBaseClass, isActive("out-of-stock") && "ring-2 ring-[#ef4444]")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#64748B]">Rupture de stock</CardTitle>
          <div className='bg-[#ef4444]/10 p-1.5 rounded-full'>
            <AlertTriangle className="h-4 w-4 text-[#ef4444]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">
            {data?.products?.filter((p) => p.quantity === 0).length || 0}
          </div>
          <p className='text-xs text-[#dc2626] my-2'>Nécessite une action</p>
        </CardContent>
      </Card>
      <Card
        size="sm"
        onClick={() => handleClick("low-stock")}
        className={cn(cardBaseClass, isActive("low-stock") && "ring-2 ring-[#f59e0b]")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#64748B]">Stock faible</CardTitle>
          <div className='bg-[#f59e0b]/10 p-1.5 rounded-full'>
            <AlertCircle className="h-4 w-4 text-[#f59e0b]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">
            {lowStockData?.products?.length || 0}
          </div>
          <p className='text-xs text-[#d97706] my-2'>À réapprovisionner</p>
        </CardContent>
      </Card>
      <Card
        size="sm"
        onClick={() => handleClick("has-sales")}
        className={cn(cardBaseClass, isActive("has-sales") && "ring-2 ring-[#3b82f6]")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#64748B]">Total des ventes</CardTitle>
          <div className='bg-[#3b82f6]/10 p-1.5 rounded-full'>
            <ShoppingCart className="h-4 w-4 text-[#3b82f6]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">
            {data?.products?.reduce((acc, p) => acc + (p.Number_of_sales || 0), 0)}
          </div>
          <p className='text-xs text-[#2563eb] my-2'>Performance globale</p>
        </CardContent>
      </Card>
    </div>
  )
}
