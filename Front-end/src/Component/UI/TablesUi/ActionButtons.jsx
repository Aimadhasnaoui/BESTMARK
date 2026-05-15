import { Pencil, Trash2, Eye, Lock, Power, PowerOff } from "lucide-react";

export function ActionButtons({ onEdit, onDelete, onSee, onPassword, onToggleActive, isSee = false, isActive = true }) {
  return (
    <div className="flex gap-2 w-full justify-center">
      {isSee && (
        <button
          type="button"
          onClick={onSee}
          className="flex items-center gap-2 px-2 py-2 rounded-full border border-orange-600"
        >
          <Eye className="w-3.5 h-3.5 text-orange-600 cursor-pointer hover:text-blue-800 text-xs" />
        </button>
      )}
      {onPassword && (
        <button
          type="button"
          onClick={onPassword}
          className="flex items-center gap-2 px-2 py-2 rounded-full border border-purple-600"
        >
          <Lock className="w-3.5 h-3.5 text-purple-600 cursor-pointer hover:text-purple-800 text-xs" />
        </button>
      )}
      {onToggleActive && (
        <button
          type="button"
          onClick={onToggleActive}
          className={`flex items-center gap-2 px-2 py-2 rounded-full border ${isActive ? "border-emerald-600" : "border-red-600"}`}
        >
          {isActive ? (
            <Power className="w-3.5 h-3.5 text-emerald-600 cursor-pointer hover:text-emerald-800 text-xs" />
          ) : (
            <PowerOff className="w-3.5 h-3.5 text-red-600 cursor-pointer hover:text-red-800 text-xs" />
          )}
        </button>
      )}
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-2 px-2 py-2 rounded-full border border-blue-600"
      >
        <Pencil className="w-3.5 h-3.5 text-blue-600 cursor-pointer hover:text-blue-800 text-xs" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="flex items-center gap-2 px-2 py-2 rounded-full border border-red-600"
      >
        <Trash2 className="w-3.5 h-3.5 cursor-pointer text-red-600 hover:text-red-800 text-xs" />
      </button>
    </div>
  );
}
