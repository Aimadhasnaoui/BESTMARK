import React from 'react'
import { Card, CardContent, CardHeader, CardTitle,CardFooter } from "@/components/ui/card"
import { Package, AlertTriangle, AlertCircle, ShoppingCart } from "lucide-react"

export default function ProductsStatic({data}) {
  return (
   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium text-[#64748B] ">Total des produits</CardTitle>
          <div className='bg-[#10b981]/10 p-2 rounded-full'>
          <Package className="h-6 w-6 text-[#10b981]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.products?.length || 0}</div>
          <p className='text-xs text-[#059669] my-2'>12% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium text-[#64748B]">Rupture de stock</CardTitle>
          <div className='bg-[#ef4444]/10 p-2 rounded-full'>
            <AlertTriangle className="h-6 w-6 text-[#ef4444]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.products?.filter((p) => p.quantity === 0).length || 0}
          </div>
          <p className='text-xs text-[#dc2626] my-2'>Nécessite une action</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium text-[#64748B]">Stock faible</CardTitle>
          <div className='bg-[#f59e0b]/10 p-2 rounded-full'>
            <AlertCircle className="h-6 w-6 text-[#f59e0b]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.products?.filter((p) => p.quantity > 0 && p.quantity <= 5).length || 0}
          </div>
          <p className='text-xs text-[#d97706] my-2'>À réapprovisionner</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium text-[#64748B]">Total des ventes</CardTitle>
          <div className='bg-[#3b82f6]/10 p-2 rounded-full'>
            <ShoppingCart className="h-6 w-6 text-[#3b82f6]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.products?.reduce((acc, p) => acc + (p.Number_of_sales || 0), 0)}
          </div>
          <p className='text-xs text-[#2563eb] my-2'>Performance globale</p>
        </CardContent>
      </Card>
    </div>
  )
}
