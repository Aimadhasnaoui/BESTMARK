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
  data = [],
  columns,
  isAjouter = true,
  ButtonText = "Ajouter",
  onButtonClick,
  TableTitle,
  isLoading,
  isError,
  ErrorMessage='Error Occured while fetching data',
  // Server-side pagination props (optional)
  serverPagination,
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
        pageSize: serverPagination ? data.length || 50 : 50,
      },
    },
  });

  // Server pagination helpers
  const isServerPaginated = !!serverPagination;
  const serverPage = serverPagination?.currentPage || 1;
  const serverTotalPages = serverPagination?.totalPages || 1;
  const serverTotalDocs = serverPagination?.totalDocs || 0;
  const onPageChange = serverPagination?.onPageChange;

  return (
    <div className="p-3 sm:p-6">
      {/* Search Input */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center py-2 mb-4">
        <InputGroup className="w-full sm:w-[350px] rounded-md bg-white">
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
            size="sm"
            variant="default"
            className="cursor-pointer bg-[#0050CB] text-white hover:bg-[#0050CB]/90"
            onClick={onButtonClick}
          >
            <Plus />
            {ButtonText}
          </Button>
        )}
      </div>

      {/* The Table UI */}
      <div className="h-[600px] w-full bg-white overflow-x-auto shadow-sm hide-scrollbar">
        <table className="min-w-full  w-full    bg-white border border-gray-200">
          <thead className="bg-[#2563EB] sticky top-0 z-10 w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-4 py-3 border-b border-white/10 text-left text-[11px] font-semibold uppercase tracking-wider text-white ${header.column.columnDef.className || ''}`}
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
                        <td key={column.id} className="px-4 py-3 border-b">
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
                      <td key={cell.id} className={`px-4 py-3 border-b text-sm text-[#1E293B] ${cell.column.columnDef.className || ''}`}>
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

      {/* Pagination Controls */}
      {isServerPaginated ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 bg-white border-t">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-700">
              Page{" "}
              <strong className="font-semibold">{serverPage}</strong>{" "}
              sur <strong className="font-semibold">{serverTotalPages}</strong>{" "}
              — <strong>{serverTotalDocs}</strong> {TableTitle || "résultats"}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(1)}
              disabled={serverPage <= 1}
              className="px-3 py-1 border rounded disabled:opacity-50 bg-white cursor-pointer"
            >
              {"<<"}
            </button>
            <button
              onClick={() => onPageChange?.(serverPage - 1)}
              disabled={serverPage <= 1}
              className="px-3 py-1 border rounded disabled:opacity-50 bg-white cursor-pointer"
            >
              Précédent
            </button>
            <button
              onClick={() => onPageChange?.(serverPage + 1)}
              disabled={serverPage >= serverTotalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 bg-white cursor-pointer"
            >
              Suivant
            </button>
            <button
              onClick={() => onPageChange?.(serverTotalPages)}
              disabled={serverPage >= serverTotalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 bg-white cursor-pointer"
            >
              {">>"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 bg-white border-t">
          <div className="flex flex-wrap gap-2 items-center">
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
      )}
    </div>
  );
}
