import React, { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";
import Notification from "../Notification/Notification";
import NavSearch from "./NavSearch";

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
    <div className="sticky top-0 z-30 w-full py-3 px-4 flex items-center justify-between gap-3 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="shrink-0" />
        <h1 className="truncate text-base font-medium text-[#2563EB]">
          {PageName}
        </h1>
      </div>

      <div className="hidden sm:flex flex-1 justify-center px-4">
        <NavSearch />
      </div>

      <div className="flex gap-3 sm:gap-4 items-center shrink-0">
        <Notification />
        <UserMenu />
      </div>
    </div>
  );
}
