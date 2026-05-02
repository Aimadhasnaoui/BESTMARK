import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';

export function ActionButtons({ onEdit, onDelete, onSee, isSee = false }) {
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