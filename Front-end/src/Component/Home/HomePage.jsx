import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./AppSidebar";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
function HomePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-w-0 ">
        <NavBar />
        <div className=" px-6 py-4 bg-[#f7f9fb] min-h-screen">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default HomePage