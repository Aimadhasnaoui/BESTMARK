import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PackageSearch,IdCardLanyard,ShieldCheck } from 'lucide-react'
import ProductType from './ProductType/ProductType'
import EmploisType from './EmploisType/EmploisType'
import PermissionModels from './PermissionModels/PermissionModels'
import { useModelPermissions } from '@/hooks/usePermissions'
export default function SettingPage() {
  const { canView: canViewProductTypes } = useModelPermissions("Types de produits")
  const { canView: canViewEmployeeTypes } = useModelPermissions("Types d'employés")
  const { canView: canViewPermissionModels } = useModelPermissions("Modèles & Permissions")

  const defaultValue = canViewProductTypes
    ? "overview"
    : canViewEmployeeTypes
      ? "analytics"
      : "permissions"

  return (
    <div className=''>
 <Tabs defaultValue={defaultValue}>
      <TabsList variant="line" className='gap-8 border-b border-gray-300 justify-start px-0'>
        {canViewProductTypes && (
          <TabsTrigger value="overview" className='flex flex-row gap-3 items-center cursor-pointer pb-2'>
            <PackageSearch/>Types de produits</TabsTrigger>
        )}
        {canViewEmployeeTypes && (
          <TabsTrigger value="analytics" className='flex flex-row gap-3 items-center cursor-pointer pb-2'>
            <IdCardLanyard/>Types d'employés</TabsTrigger>
        )}
        {canViewPermissionModels && (
          <TabsTrigger value="permissions" className='flex flex-row gap-3 items-center cursor-pointer pb-2'>
            <ShieldCheck/>Modèles & Permissions</TabsTrigger>
        )}
      </TabsList>
        {canViewProductTypes && <TabsContent value="overview"><ProductType/></TabsContent>}
      {canViewEmployeeTypes && <TabsContent value="analytics"><EmploisType/></TabsContent>}
      {canViewPermissionModels && <TabsContent value="permissions"><PermissionModels/></TabsContent>}
    </Tabs>
    </div>
  )
}
