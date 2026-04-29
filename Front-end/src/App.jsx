import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./Component/Ui/AppSidebar";
function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <div>
          
        </div>
      </main>
    </SidebarProvider>
  )
}

export default App;
