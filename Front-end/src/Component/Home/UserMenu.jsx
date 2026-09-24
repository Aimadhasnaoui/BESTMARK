import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
    <div
      onClick={() => navigate("/profile")}
      className="flex items-center gap-2.5 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-all group"
      title="Voir mon profil"
    >
      <UserAvatar userInfo={userInfo} className="ring-2 ring-transparent group-hover:ring-[#0066FF]/20" />
    </div>
  );
}
