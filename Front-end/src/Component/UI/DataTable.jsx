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
import { Search, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; 
export function DataTable({
  data,
  columns,
  isAjouter = true,
  ButtonText = "Ajouter",
  onButtonClick,
  TableTitle,
  isLoading,
  isError,
  ErrorMessage='Error Occured while fetching data',
  
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
            size="lg"
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
                    className={`px-6 py-5 border-b text-left text-[#64748B] ${header.column.columnDef.className || ''}`}
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
            {
              isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {
                      columns.map((column) => (
                        <td key={column.id} className="px-5 py-4 border-b">
                          <Skeleton className="h-4 w-[250px]" />
                        </td>
                      ))
                    }
             
                  </tr>
                ))
              ) :isError ? (
                <tr>
                  <td colSpan={columns.length} className="py-20">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="bg-red-50 p-4 rounded-full">
                        <AlertCircle className="h-10 w-10 text-red-500" />
                      </div>
                      <p className="text-red-600 text-lg font-semibold">{ErrorMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={`px-5 py-4 border-b text-[#1E293B] ${cell.column.columnDef.className || ''}`}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )
            }
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
