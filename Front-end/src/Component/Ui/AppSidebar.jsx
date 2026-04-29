import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenuAction,
  useSidebar,
} from "@/components/ui/sidebar";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { Collapsible } from "@/components/ui/collapsible";
import {
  User2,
  Plus,
  ChevronDown,
  Home,
  LayoutDashboard,
  Package,
  ClipboardList,
  Receipt,
  Banknote,
  Users2,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";
import Logo from "@/assets/Logo/logo.png";

export default function AppSidebar() {
  const { state, setOpen } = useSidebar();
  const [currentPage, setcurrentPage] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "stock", label: "Stock Management", icon: ClipboardList },
    { id: "sales", label: "Sales & POS", icon: Receipt },
    { id: "finance", label: "Finance", icon: Banknote },
    { id: "suppliers", label: "Suppliers & Employees", icon: Users2 },
    { id: "requests", label: "Customer Requests", icon: HelpCircle },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className={state === "collapsed" ? "cursor-pointer" : ""}
      onClick={() => {
        if (state === "collapsed") {
          setOpen(true);
        }
      }}
    >
      {/*sidebar header*/}
      <SidebarHeader className="flex flex-row items-center group-data-[collapsible=icon]:justify-center">
        <img
          src={Logo}
          alt="Logo"
          className="w-10 object-cover transition-all group-data-[collapsible=icon]:w-8"
        />
        <div className="text-2xl font-bold pl-2 group-data-[collapsible=icon]:hidden">
          <span>Store</span>
          <span className="text-[#0066FF]">Pilot</span>
        </div>
      </SidebarHeader>
      {/* sidebar content */}
      <SidebarContent className="py-4">
        <SidebarMenu className="gap-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild>
                <a
                  href="#"
                  onClick={() => setcurrentPage(item.id)}
                  className={`rounded-none cursor-pointer transition-all  ${
                    currentPage === item.id
                      ? "bg-[#EFF6FF] border-l-4 border-[#0066FF] text-[#2563EB]"
                      : "border-l-4 border-transparent !hover:bg-slate-50 text-[#475569]"
                  }`}
                >
                  <item.icon size={24} />
                  <span className="group-data-[collapsible=icon]:hidden text-[16px] font-medium">
                    {item.label}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* sidebar content */}
      {/*sidebar footer*/}
      <SidebarFooter>
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                href="#"
                onClick={() => setcurrentPage("settings")}
                className={`rounded-none cursor-pointer transition-all ${
                  currentPage === "settings"
                    ? "bg-[#EFF6FF] border-l-4 border-[#0066FF] text-[#2563EB]"
                    : "border-l-4 border-transparent !hover:bg-slate-50 text-[#475569]"
                }`}
              >
                <Settings size={24} />
                <span className="group-data-[collapsible=icon]:hidden text-[16px] font-medium">
                  Settings
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                href="#"
                className="rounded-none cursor-pointer transition-all border-l-4 border-transparent !hover:bg-red-100 text-red-500"
              >
                <LogOut size={24} />
                <span className="group-data-[collapsible=icon]:hidden text-[16px] font-medium">
                  Logout
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/*sidebar footer*/}
    </Sidebar>
  );
}
