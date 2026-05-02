import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PackageSearch,UserCog,IdCardLanyard } from 'lucide-react'
import ProductType from './ProductType/ProductType'
import EmploisType from './EmploisType/EmploisType'
import Profile from './Profil/Profile'
export default function SettingPage() {
  return (
    <div className=''>
 <Tabs defaultValue="overview">
      <TabsList variant="line" className='w-full gap-8 border-b border-gray-300 justify-start px-0'>
        <TabsTrigger value="overview" className='flex text-md flex-row gap-3 items-center cursor-pointer pb-2'>
          <PackageSearch/>Product Types</TabsTrigger>
        <TabsTrigger value="analytics" className='flex text-md flex-row gap-3 items-center cursor-pointer pb-2'>
          <IdCardLanyard/>Employee Types</TabsTrigger>
        <TabsTrigger value="reports" className='flex text-md flex-row gap-3 items-center cursor-pointer pb-2'>
          <UserCog/>Profile</TabsTrigger>
      </TabsList>
        <TabsContent value="overview"><ProductType/></TabsContent>
      <TabsContent value="analytics"><EmploisType/></TabsContent>
      <TabsContent value="reports"><Profile/></TabsContent>
    </Tabs>
    </div>
  )
}
