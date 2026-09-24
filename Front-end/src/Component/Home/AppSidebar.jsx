import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
  FileBarChart,
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
import {
  clearPermissions,
  hasModelAccess,
  hasAnyModelAccess,
} from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";

export default function AppSidebar({ currentPage, setcurrentPage }) {
  const { state, setOpen } = useSidebar();
  const navigate = useNavigate();
  const { permissions } = usePermissions();
  const { mutate, isError } = useMutation({
    mutationFn: LogOutUser,
    onSuccess: () => {
      clearPermissions();
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
    { id: "products", label: "Produits", icon: Package, path: "/products" },
    {
      id: "stock",
      label: "Gestion de Stock",
      icon: ClipboardList,
      path: "/stock",
    },
    { id: "purchases", label: "Achats", icon: ShoppingBag, path: "/purchases" },
    { id: "sales", label: "Ventes", icon: Receipt, path: "/sales" },
    {
      id: "requests",
      label: "Demandes clients",
      icon: HelpCircle,
      path: "/requests",
    },
    { id: "delivery", label: "Livraisons", icon: Truck, path: "/delivery" },
    {
      id: "finance-report",
      label: "Finance Rapport",
      icon: FileBarChart,
      path: "/finance-report",
    },
    {
      id: "suppliers",
      label: "Fournisseurs",
      icon: Users2,
      path: "/suppliers",
    },
    { id: "employees", label: "Employés", icon: User2, path: "/employees" },
    { id: "finance", label: "Finance", icon: Banknote, path: "/finance" },
  ];

  const visibleMenuItems = menuItems.filter((item) =>
    hasModelAccess(permissions, item.label),
  );

  const canViewSettings = hasAnyModelAccess(permissions, [
    "Modèles & Permissions",
    "Types de produits",
    "Types d'employés",
  ]);

  return (
    <Sidebar
      collapsible="icon"
      className={`${state === "collapsed" ? "cursor-pointer" : ""}`}
      style={{ "--sidebar": "oklch(1 0 0)" }}
      onClick={() => {
        if (state === "collapsed") {
          setOpen(true);
        }
      }}
    >
      {/* sidebar header */}
      <SidebarHeader className="flex flex-row items-center group-data-[collapsible=icon]:justify-center">
        <img
          src={Logo}
          alt="Logo"
          className="w-10 object-cover transition-all group-data-[collapsible=icon]:w-8"
        />
        <div className="text-2xl font-bold pl-2 group-data-[collapsible=icon]:hidden">
          <span>BEST</span>
          <span className="text-[#0066FF]">MARK</span>
        </div>
      </SidebarHeader>

      {/* sidebar content */}
      <SidebarContent className="py-4">
        <SidebarMenu className="gap-2">
          {visibleMenuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.path}
                  onClick={() => setcurrentPage(item.id)}
                  className={`rounded-none cursor-pointer transition-all ${
                    currentPage === item.id
                      ? "bg-[#EFF6FF] border-l-4 border-[#0066FF] text-[#2563EB]"
                      : "border-l-4 border-transparent !hover:bg-slate-50 text-[#475569]"
                  }`}
                >
                  <item.icon size={24} />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* sidebar footer with Profil, Paramètres & Déconnexion */}
      <SidebarFooter>
        <SidebarMenu className="gap-2">
          {/* Profil */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/profile"
                onClick={() => setcurrentPage("profile")}
                className={`rounded-none cursor-pointer transition-all ${
                  currentPage === "profile"
                    ? "bg-[#EFF6FF] border-l-4 border-[#0066FF] text-[#2563EB]"
                    : "border-l-4 border-transparent !hover:bg-slate-50 text-[#475569]"
                }`}
              >
                <User2 size={24} />
                <span className="group-data-[collapsible=icon]:hidden">
                  Profil
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Paramètres (if permitted) */}
          {canViewSettings && (
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
                  <span className="group-data-[collapsible=icon]:hidden">
                    Paramètres
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Déconnexion */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={mutate}
                className="rounded-none cursor-pointer transition-all border-l-4 border-transparent !hover:bg-red-100 text-red-500 !hover:text-white"
              >
                <LogOut size={24} />
                <span className="group-data-[collapsible=icon]:hidden">
                  déconnexion
                </span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
