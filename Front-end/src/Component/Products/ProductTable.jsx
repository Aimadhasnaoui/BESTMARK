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
import { Search, AlertCircle, ArrowUpRight, ArrowDownLeft, Box, Layers, DollarSign, BarChart3, Archive, Bell, Truck, MoreHorizontal, Filter, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionButtons } from "../UI/TablesUi/ActionButtons";
import { getImageUrl } from "@/lib/utils";
// import Filter from "./Actions/Filter";

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
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    category: null,
    supplier: null,
    stockStatus: "all",
    priceRange: [0, 20000],
  });

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Category filter
      if (filters.category && item.category?._id !== filters.category._id) return false;
      
      // Supplier filter
      if (filters.supplier && item.supplier?._id !== filters.supplier._id) return false;
      
      // Stock Status filter
      if (filters.stockStatus === "lowStock") {
        if (!(item.quantity > 0 && item.quantity <= item.minStockAlert)) return false;
      } else if (filters.stockStatus === "outOfStock") {
        if (item.quantity > 0) return false;
      } else if (filters.stockStatus === "inStock") {
        if (item.quantity === 0) return false;
      }
      
      // Price Range filter
      if (item.sellingPrice < filters.priceRange[0] || item.sellingPrice > filters.priceRange[1]) return false;
      
      return true;
    });
  }, [data, filters]);
  const columns = useMemo(
    () => [
      {
        header: () => (
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-blue-600" />
            <span>PRODUCT</span>
          </div>
        ),
        accessorKey: "image",
        cell: ({ row }) => (
          <div className='w-[300px] flex items-center gap-4'>
          <div className="w-20 h-20 rounded-md overflow-hidden">
            {row.original.image ? (
              <img
                src={getImageUrl(row.original.image)}
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
        header: () => (
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>CATEGORY</span>
          </div>
        ),
        accessorKey: "category.name",
         cell: ({ row }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
            {row.original.category.name}
          </span>
        )
      },
    {
        header: () => (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span>PRICE</span>
          </div>
        ),
        accessorKey: "sellingPrice",
        cell: ({ row }) => (
          <div className='flex flex-col gap-1.5 w-[110px]'>
            <div className='flex items-center gap-2'>
              <div className='flex items-center justify-center w-6 h-6 rounded-md bg-green-50 text-green-600'>
                <ArrowUpRight className='w-3.5 h-3.5' />
              </div>
              <span className='font-bold text-[0.9rem] text-slate-800'>{row.original.sellingPrice} <span className='text-[0.7rem] text-slate-500 font-medium'>DH</span></span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex items-center justify-center w-6 h-6 rounded-md bg-amber-50 text-amber-600'>
                <ArrowDownLeft className='w-3.5 h-3.5' />
              </div>
              <span className='text-xs font-semibold text-slate-500'>{row.original.buyingPrice} <span className='text-[0.6rem] text-slate-400'>DH</span></span>
            </div>
          </div>
        )
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span>SALES</span>
          </div>
        ),
        accessorKey: "Number_of_sales",
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <Archive className="w-4 h-4 text-emerald-600" />
            <span>QUANTITY</span>
          </div>
        ),
        accessorKey: "quantity",
        cell: ({ row }) => (
          <span className={`font-bold ${row.original.quantity <= row.original.minStockAlert ? 'text-red-500' : ''}`}>
            {row.original.quantity}
          </span>
        )
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-600" />
            <span>ALERT</span>
          </div>
        ),
        accessorKey: "minStockAlert",
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-600" />
            <span>SUPPLIER</span>
          </div>
        ),
        accessorKey: "supplier.name",
         cell: ({ row }) => (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
            row.original.supplier 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
              : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}>
            {row.original.supplier?.name || "Aucun fournisseur"}
          </span>
        )
      },
      {
        header: () => (
          <div className="flex items-center gap-2">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
            <span>ACTIONS</span>
          </div>
        ),
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
    data: filteredData,
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
    <div className="">
      {/* Search Input */}
      <div className="flex justify-between items-center p-2 border rounded-t-xl shadow-sm  bg-white">
        <div className="flex items-center gap-2">
          <InputGroup className="w-[350px] rounded-md bg-white">
            <InputGroupAddon>
              <Search className="w-4 h-4 text-gray-400" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search products..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </InputGroup>

        </div>
        
        {/* Quick info or view toggles can go here */}
        <div className="flex items-center gap-2 px-2">
 
                   <Button 
            variant="outline" 
            className="flex items-center gap-2 text-slate-600 border-slate-200 hover:bg-slate-50"
            onClick={() => setIsFiltering(true)}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtrer</span>
          </Button>
        </div>
      </div>

      {/* The Table UI */}
      <div className="h-[600px] w-full bg-white overflow-x-auto shadow-sm hide-scrollbar ">
        <table className="min-w-full  w-full  bg-white  ">
          <thead className="sticky top-0 z-10 w-full bg-slate-100  ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-6 py-3 border-b text-left text-[0.9rem] font-semibold text-slate-700 border-l ${header.column.columnDef.className || ''}`}
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
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors cursor-pointer text-center  ">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={`px-5 py-4 border-b text-[#1E293B] border-l ${cell.column.columnDef.className || ''}`}>
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
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t rounded-b-xl shadow-sm">
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-700">
            Montrant <span className="font-semibold">{table.getRowModel().rows.length}</span> sur{" "}
            <span className="font-semibold">{filteredData.length}</span> produits filtrés
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 bg-white text-sm"
          >
            {"<<"}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 bg-white text-sm"
          >
            Précédent
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 bg-white text-sm"
          >
            Suivant
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 bg-white text-sm"
          >
            {">>"}
          </button>
        </div>
      </div>

      {/* {isFiltering && (
        <Filter 
          isFiltering={isFiltering} 
          setIsFiltering={setIsFiltering} 
          onApplyFilters={setFilters} 
          currentFilters={filters}
        />
      )} */}
    </div>
  );
}
