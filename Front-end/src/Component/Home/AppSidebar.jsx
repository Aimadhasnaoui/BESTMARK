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
import { Link } from "react-router-dom";
import {
  User2,
  LayoutDashboard,
  Package,
  ClipboardList,
  Receipt,
  Banknote,
  Users2,
  HelpCircle,
  Settings,
  LogOut,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Logo from "@/assets/Logo/logo.png";
import { useMutation } from "@tanstack/react-query";
import { LogOutUser } from "@/Servises/Autontification";
import { useNavigate } from "react-router-dom";
export default function AppSidebar({ currentPage, setcurrentPage }) {
  const { state, setOpen } = useSidebar();
  const navigate = useNavigate();
  const { mutate, isError } = useMutation({
    mutationFn: LogOutUser,
    onSuccess: () => {
      navigate("/login");
    },
  });

  const menuItems = [
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    { id: "purchases", label: "Achats", icon: ShoppingBag, path: "/purchases" },
    { id: "products", label: "Produits", icon: Package, path: "/products" },
    {
      id: "stock",
      label: "Gestion de Stock",
      icon: ClipboardList,
      path: "/stock",
    },
    { id: "sales", label: "Ventes", icon: Receipt, path: "/sales" },
    {
      id: "requests",
      label: "Demandes clients",
      icon: HelpCircle,
      path: "/requests",
    },
    { id: "delivery", label: "Livraisons", icon: Truck, path: "/delivery" },
    { id: "finance", label: "Finance", icon: Banknote, path: "/finance" },
    {
      id: "suppliers",
      label: "Fournisseurs",
      icon: Users2,
      path: "/suppliers",
    },
    { id: "employees", label: "Employés", icon: User2, path: "/employees" },
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
                <Link
                  to={item.path}
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
                </Link>
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
              <Link
                to="/settings"
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
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                // href="#"
                onClick={mutate}
                className="rounded-none cursor-pointer transition-all border-l-4 border-transparent !hover:bg-red-100 text-red-500 !hover:text-white"
              >
                <LogOut size={24} />
                <span className="group-data-[collapsible=icon]:hidden text-[16px] font-medium">
                  Logout
                </span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/*sidebar footer*/}
    </Sidebar>
  );
}
