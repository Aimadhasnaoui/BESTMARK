import React, { useState,useEffect ,useContext} from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search,Bell  } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useLocation } from "react-router-dom";
import { DataContext } from "../Data/contextApi";
import { getImageUrl } from "@/lib/utils";
export default function NavBar() {
  const[PageName,setPageName] = useState("Tableau de bord")
  const location = useLocation();
  const {userInfo} = useContext(DataContext)
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
      default:
        setPageName("Tableau de bord");
    }
  }, [location]);
  return (
    <div className="w-full py-3 px-4 flex items-center justify-between gap-3 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-3 ">
        <SidebarTrigger />
        <h1 className="text-2xl font-medium text-[#2563EB]">{PageName}</h1>
      </div>
      <div>
        
      </div>
      <div className="flex gap-4 items-center">
        <InputGroup className="w-[350px] rounded-md focus-visible:ring-amber-500">
          <InputGroupAddon>
            <Search className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search products, orders, or customers..." />
        </InputGroup>
          <Bell className="text-muted-foreground cursor-pointer" />
          <div className="flex items-center gap-2 border-l border-slate-200 px-3">
              <div className="flex flex-col">
                  <p className="text-sm font-medium">{userInfo?.name}</p>
                  <p className="text-sm text-muted-foreground">{userInfo?.mission?.name}</p>
              </div>
        <Avatar>
            <AvatarImage src={getImageUrl(userInfo?.image)} alt={userInfo?.name} />
            <AvatarFallback>
              {userInfo?.name ? userInfo.name.slice(0, 2).toUpperCase() : "CN"}
            </AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
          </div>

      </div>
    </div>
  );
}
