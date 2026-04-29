import React from "react";
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

export default function NavBar() {
  return (
    <div className="w-full py-3 px-4 flex items-center justify-between gap-3 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-3 ">
        <SidebarTrigger />

        <InputGroup className="w-[400px] rounded-md focus-visible:ring-amber-500">
          <InputGroupAddon>
            <Search className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search products, orders, or customers..." />
        </InputGroup>
      </div>
      <div className="flex gap-4 items-center">
          <Bell className="text-muted-foreground" />
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
