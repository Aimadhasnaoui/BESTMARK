import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./AppSidebar";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
function HomePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <NavBar />
        <div className="flex-1 px-6 py-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default HomePage