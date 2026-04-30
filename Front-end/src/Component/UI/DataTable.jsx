import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

export function DataTable({
  data,
  columns,
  isAjouter = true,
  ButtonText = "Ajouter",
  onButtonClick,
  TableTitle,
}) {
  const [globalFilter, setGlobalFilter] = useState("");

  // 2. The "Brain" of the table
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 50, // 2. Set default page size (e.g., 5 rows per page)
      },
    },
  });

  return (
    <div className="p-6">
      {/* Search Input */}
      <div className="flex justify-between items-center py-2 mb-4">
        <InputGroup className="w-[350px] rounded-md focus-visible:ring-amber-500">
          <InputGroupAddon>
            <Search className="w-4 h-4 text-gray-400" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </InputGroup>
        {isAjouter && (
          <Button
            className="bg-[#0050CB] cursor-pointer text-white rounded-md py-4 px-2"
            onClick={onButtonClick}
          >
            <Plus className="w-4 h-4" />
            {ButtonText}
          </Button>
        )}
      </div>

      {/* The Table UI */}
      <div className="h-[600px] overflow-auto  shadow-sm hide-scrollbar">
        <table className="min-w-full   bg-white border border-gray-200">
          <thead className="bg-[#F8FAFC] sticky top-0 z-10 w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-5 border-b text-left text-[#64748B]"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-4 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
        <div className="flex gap-2 items-center">
          {/* Page Info */}
          <span className="text-sm text-gray-700">
            showing{" "}
            <strong className="font-semibold">
              {table.getState().pagination.pageIndex + 1}
            </strong>{" "}
            of <strong className="font-semibold">{table.getPageCount()}</strong>{" "}
            {TableTitle}
          </span>

          {/* Page Size Selector */}
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="p-1 border rounded bg-white text-sm"
          >
            {[50, 100, 200].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          {/* First & Previous Buttons */}
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 bg-white"
          >
            {"<<"}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 bg-white"
          >
            Previous
          </button>

          {/* Next & Last Buttons */}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 bg-white"
          >
            Next
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 bg-white"
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
}
