import React, { useState,useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search,Bell  } from "lucide-react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useLocation } from "react-router-dom";
export default function NavBar() {
  const[PageName,setPageName] = useState("Dashboard")
  const location = useLocation();
  useEffect(() => {
    switch (location.pathname) {
      case "/dashboard":
        setPageName("Dashboard");
        break;
      case "/products":
        setPageName("Products");
        break;
      case "/stock":
        setPageName("Stock");
        break;
      case "/sales":
        setPageName("Sales");
        break;
      case "/finance":
        setPageName("Finance");
        break;
      case "/suppliers":
        setPageName("Suppliers");
        break;
      case "/requests":
        setPageName("Requests");
        break;
      case "/settings":
        setPageName("Settings");
        break;
      default:
        setPageName("Dashboard");
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
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">Owner</p>
              </div>
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
          </div>

      </div>
    </div>
  );
}
