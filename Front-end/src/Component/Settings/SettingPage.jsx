import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PackageSearch,UserCog,IdCardLanyard } from 'lucide-react'
import ProductType from './ProductType/ProductType'
import EmploisType from './EmploisType/EmploisType'
export default function SettingPage() {
  return (
    <div className=''>
 <Tabs defaultValue="overview">
      <TabsList variant="line" className='gap-8 border-b border-gray-300 justify-start px-0'>
        <TabsTrigger value="overview" className='flex flex-row gap-3 items-center cursor-pointer pb-2'>
          <PackageSearch/>Product Types</TabsTrigger>
        <TabsTrigger value="analytics" className='flex flex-row gap-3 items-center cursor-pointer pb-2'>
          <IdCardLanyard/>Employee Types</TabsTrigger>
      </TabsList>
        <TabsContent value="overview"><ProductType/></TabsContent>
      <TabsContent value="analytics"><EmploisType/></TabsContent>
    </Tabs>
    </div>
  )
}
