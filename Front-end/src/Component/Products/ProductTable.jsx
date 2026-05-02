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
import { ActionButtons } from "../UI/TablesUi/ActionButtons";
export default function ProductTable({
  data = [],
  TableTitle,
  isLoading,
  isError,
  ErrorMessage='Error Occured while fetching data',
  onDelete,
  onEdit,
  onSee
  
  
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const columns = useMemo(
    () => [
      {
        header: "PRODUCT",
        accessorKey: "image",
        cell: ({ row }) => (
          <div className='w-[300px] flex items-center gap-4'>
          <div className="w-20 h-20 rounded-md overflow-hidden">
            {row.original.image ? (
              <img
                src={row.original.image}
                alt={row.original.name}
                className="w-full h-full object-cover"
              />

            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className='flex flex-col gap-1'>
            <p className='w-[150px] font-semibold'>{row.original.name}</p>
            <div className='flex items-center gap-1'>
              <p className='text-xs text-gray-500'>{row.original.barcode}</p>
            </div>
          </div>
          </div>
        ),
      },
      {
        header: "CATEGORY",
        accessorKey: "category.name",
         cell: ({ row }) => (
          <span className="font-semibold  text-gray-500">{row.original.category.name}</span>
        )
      },
    {
        header: "PRICE",
        accessorKey: "sellingPrice",
        cell: ({ row }) => (
          <div className='flex flex-col gap-1 w-[100px] items-center'>
            <p className='font-semibold'>{row.original.sellingPrice} DH</p>
            <p className='text-xs text-gray-500'>{row.original.buyingPrice} DH</p>
          </div>
        )
      },
      {
        header: "Number of sales",
        accessorKey: "Number_of_sales",
      },
      {
        header: "Quantity",
        accessorKey: "quantity",
        cell: ({ row }) => (
          <span className={`font-bold ${row.original.quantity <= row.original.minStockAlert ? 'text-red-500' : ''}`}>
            {row.original.quantity}
          </span>
        )
      },
      {
        header: "Min Stock Alert",
        accessorKey: "minStockAlert",
      },
            {
        header: "Supplier",
        accessorKey: "supplier.name",
      },
      {
        header: "Actions",
        accessorKey: "actions",
        className: "sticky right-0 bg-white border-l",
        cell: ({ row }) => (
          <ActionButtons
            onEdit={()=>onEdit(row.original)}
            onDelete={()=>onDelete(row.original)}
            isSee = { true }
            onSee={() => {
              console.log("See", row.original);
            }}
          />
        ),
      },
    ],
    [onEdit, onDelete, onSee]
  );
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
        <InputGroup className="w-[350px] rounded-md bg-white">
          <InputGroupAddon>
            <Search className="w-4 h-4 text-gray-400" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </InputGroup>
      </div>

      {/* The Table UI */}
      <div className="h-[600px] w-full bg-white overflow-x-auto shadow-sm hide-scrollbar ">
        <table className="min-w-full  w-full    bg-white  ">
          <thead className="sticky top-0 z-10 w-full bg-[#e2e8f0a3]   ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-6 py-5 border-b text-centre text-black ${header.column.columnDef.className || ''}`}
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
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors cursor-pointer text-center">
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
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
        <div className="flex gap-2 items-center">
          {/* Page Info */}
          <span className="text-sm text-gray-700">
            montrer{" "}
            <strong className="font-semibold">
              {table.getState().pagination.pageIndex + 1}
            </strong>{" "}
            dans <strong className="font-semibold">{table.getPageCount()}</strong>{" "}
            des produits
          </span>

          {/* Page Size Selector */}
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="p-1 border rounded bg-white text-sm"
          >
            {[50, 100, 200].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
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
