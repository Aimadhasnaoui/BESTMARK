import React, { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";
export default function NavBar() {
  const [PageName, setPageName] = useState("Tableau de bord");
  const location = useLocation();
  useEffect(() => {
    switch (location.pathname) {
      case "/dashboard":
        setPageName("Tableau de bord");
        break;
      case "/products":
        setPageName("Produits");
        break;
      case "/purchases":
        setPageName("Achats");
        break;
      case "/stock":
        setPageName("Gestion de Stock");
        break;
      case "/sales":
        setPageName("Ventes");
        break;
      case "/finance":
        setPageName("Finance");
        break;
      case "/suppliers":
        setPageName("Fournisseurs");
        break;
      case "/employees":
        setPageName("Employés");
        break;
      case "/delivery":
        setPageName("Livraisons");
        break;
      case "/requests":
        setPageName("Demandes clients");
        break;
      case "/settings":
        setPageName("Paramètres");
        break;
      case "/profile":
        setPageName("Profil");
        break;
      default:
        setPageName("Tableau de bord");
    }
  }, [location]);
  return (
    <div className="w-full py-3 px-4 flex items-center justify-between gap-3 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-3 ">
        <SidebarTrigger />
        <h1 className="truncate text-base font-medium text-[#2563EB]">
          {PageName}
        </h1>
      </div>
      <div>
        <InputGroup className="h-10 w-[450px] rounded-full border-transparent bg-[#F1F5F9] px-1 shadow-none transition-all focus-within:border-[#2563EB] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#2563EB]/10">
          <InputGroupAddon className="pl-3">
            <Search className="h-4 w-4 text-[#94A3B8] transition-colors group-focus-within/input-group:text-[#2563EB]" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Rechercher produits, commandes, clients..."
            className="text-sm placeholder:text-[#94A3B8]"
          />
          <InputGroupAddon align="inline-end" className="pr-2.5">
            <kbd className="hidden items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#94A3B8] sm:inline-flex">
              ⌘K
            </kbd>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex gap-4 items-center">
        <Button size="icon" variant="outline" className="rounded-full p-2 cursor-pointer relative">
          <span className='absolute top-0 right-0 size-2 animate-bounce rounded-full bg-sky-600 dark:bg-sky-400' />
          <Bell />
        </Button>
        <UserMenu />
      </div>
    </div>
  );
}
