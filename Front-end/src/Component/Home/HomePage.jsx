import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import { Plus, ShoppingBag, Receipt } from "lucide-react";
import { useState } from "react";
import  Add   from "../Purchase/Actions/Add";
import { Button } from "@/components/ui/button";
function HomePage() {
  const [buttonAppear, setbuttoAppear] = useState(false);
  const [buyerModalOpen, setBuyerModalOpen] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-w-0 relative" >
        <NavBar />
        <div className=" px-6 py-4 bg-[#f7f9fb] min-h-screen ">
          <Outlet />
        </div>
        <div className="fixed bottom-4 right-4" onMouseEnter={() => setbuttoAppear(true)} onMouseLeave={() => setbuttoAppear(false)}>
          {
            buttonAppear && 
          <div className="flex flex-col gap-4 items-end  mb-4">

            <Button className="bg-white shadow-xl cursor-pointer  px-4 py-2 rounded-md text-gray-600 hover:border  hover:border-green-400">
              <ShoppingBag
                size={18}
                className="inline-block mr-2 text-green-400"
              />
              NEW SALE
            </Button>
            <Button className="bg-white shadow-xl px-4 py-2 rounded-md text-gray-600 cursor-pointer hover:border  hover:border-blue-400"  onClick={()=>{setBuyerModalOpen(true)}}>
              <Receipt size={18} className="inline-block mr-2 text-blue-500" />
              NEW BUYER
            </Button>
          </div>
          }
          <Button className="group flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer transition">
            <Plus size={18} className="transition-transform group-hover:rotate-90" />
            <p>New Transaction</p>
          </Button>
        </div>
        {/* {
          is
        } */}
        <Add isAdding={buyerModalOpen} setIsAdding={setBuyerModalOpen} />
      </main>
    </SidebarProvider>
  );
}

export default HomePage;
