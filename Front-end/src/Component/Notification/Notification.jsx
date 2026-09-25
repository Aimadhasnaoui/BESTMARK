import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  Bell,
  CheckCheck,
  CircleAlert,
  CircleCheck,
  Info,
  Loader2,
  TriangleAlert,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataContext } from "../Data/contextApi";
import {
  DeleteNotification,
  GetNotifications,
  MarkAllNotificationsRead,
  MarkNotificationRead,
} from "@/Servises/Notifications";

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

const TYPE_STYLES = {
  alert: { icon: CircleAlert, className: "text-red-600 bg-red-50" },
  warning: { icon: TriangleAlert, className: "text-amber-600 bg-amber-50" },
  success: { icon: CircleCheck, className: "text-green-600 bg-green-50" },
  info: { icon: Info, className: "text-[#2563EB] bg-blue-50" },
};

export default function Notification() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userInfo } = useContext(DataContext);
  const employeeId = userInfo?._id;
  const queryKey = ["notifications", employeeId];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: GetNotifications,
    enabled: !!employeeId,
    refetchInterval: REFRESH_INTERVAL,
  });
  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const refresh = () => queryClient.invalidateQueries({ queryKey });
  const markRead = useMutation({ mutationFn: MarkNotificationRead, onSuccess: refresh });
  const markAllRead = useMutation({ mutationFn: MarkAllNotificationsRead, onSuccess: refresh });
  const remove = useMutation({ mutationFn: DeleteNotification, onSuccess: refresh });

  const handleOpen = (notification) => {
    if (!notification.read) markRead.mutate(notification._id);
    if (notification.path) navigate(notification.path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full p-2 cursor-pointer relative">
          {unreadCount > 0 && (
            <span className='absolute top-0 right-0 size-2 animate-bounce rounded-full bg-sky-600 dark:bg-sky-400' />
          )}
          <Bell />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-800">Notifications</p>
            <p className="text-xs text-[#94A3B8]">
              {unreadCount > 0 ? `${unreadCount} non lue(s)` : "Tout est lu"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer text-xs text-[#2563EB]"
              disabled={markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto p-1.5">
          {isLoading && (
            <div className="flex justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin text-[#94A3B8]" />
            </div>
          )}
          {!isLoading && notifications.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-[#94A3B8]">
              Aucune notification
            </div>
          )}
          {notifications.map((notification) => {
            const { icon: Icon, className } = TYPE_STYLES[notification.type] || TYPE_STYLES.info;
            return (
              <div
                key={notification._id}
                onClick={() => handleOpen(notification)}
                className={`group flex cursor-pointer items-start gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-[#F1F5F9] ${
                  notification.read ? "" : "bg-blue-50/50"
                }`}
              >
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${className}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${notification.read ? "text-slate-600" : "font-medium text-slate-800"}`}>
                    {notification.message}
                  </p>
                  <p className="mt-0.5 text-xs text-[#94A3B8]">
                    {dayjs(notification.createdAt).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
                {!notification.read && (
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-[#2563EB]" />
                )}
                <button
                  type="button"
                  title="Supprimer"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove.mutate(notification._id);
                  }}
                  className="shrink-0 rounded p-1 text-[#94A3B8] opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
