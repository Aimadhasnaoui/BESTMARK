import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Add from "../Purchase/Actions/Add";
import AddButton from "./AddButton";
function HomePage() {
  const [buttonAppear, setbuttoAppear] = useState(false);
  const [buyerModalOpen, setBuyerModalOpen] = useState(false);
  const [currentPage, setcurrentPage] = useState("dashboard");
  
  return (
    <SidebarProvider>
      <AppSidebar currentPage={currentPage} setcurrentPage={setcurrentPage} />
      <main className="flex-1 min-w-0 relative">
        <NavBar />
        <div className=" px-6 py-4 bg-[#f7f9fb] min-h-screen ">
          <Outlet />
        </div>
        <AddButton
          buttonAppear={buttonAppear}
          setbuttoAppear={setbuttoAppear}
          setBuyerModalOpen={setBuyerModalOpen}
        />
        {
          buttonAppear && (
            <Add isAdding={buyerModalOpen} setIsAdding={setBuyerModalOpen} />
          )
        }
      </main>
    </SidebarProvider>
  );
}

export default HomePage;
