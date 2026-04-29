import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./Component/Ui/AppSidebar";
import NavBar from "./Component/Ui/NavBar";
function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <NavBar />
        <div className="flex-1">
          {/* <Outlet /> */}
        </div>
      </main>
    </SidebarProvider>
  )
}

export default App;
