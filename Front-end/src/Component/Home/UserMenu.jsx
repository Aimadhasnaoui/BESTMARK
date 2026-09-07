import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User2, Settings, LogOut, Briefcase } from "lucide-react";
import { DataContext } from "../Data/contextApi";
import { getImageUrl } from "@/lib/utils";

function UserAvatar({ userInfo, className, size = "default" }) {
  return (
    <Avatar size={size} className={className}>
      <AvatarImage src={getImageUrl(userInfo?.image)} alt={userInfo?.name} />
      <AvatarFallback>
        {userInfo?.name ? userInfo.name.slice(0, 2).toUpperCase() : "CN"}
      </AvatarFallback>
      <AvatarBadge className="bg-green-500" />
    </Avatar>
  );
}

export default function UserMenu() {
  const navigate = useNavigate();
  const { userInfo } = useContext(DataContext);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar userInfo={userInfo} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start" alignOffset={8}>
        <DropdownMenuGroup>
          <div className="-mx-1 -mt-1 mb-1 flex items-center gap-3 rounded-t-lg bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] px-4 pt-4 pb-3 text-white">
            <UserAvatar userInfo={userInfo} size="lg" className="ring-2 ring-white/60" />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold leading-tight">
                {userInfo?.name || "Utilisateur"}
              </p>
              {userInfo?.mission?.name && (
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium">
                  <Briefcase className="h-3 w-3" />
                  {userInfo.mission.name}
                </span>
              )}
            </div>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer py-2"
            onClick={() => navigate("/profile")}
          >
            <User2 className="mr-2 h-4 w-4" />
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer py-2"
            onClick={() => navigate("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" className="cursor-pointer py-2">
            <LogOut className="mr-2 h-4 w-4" />
            déconnexion
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
