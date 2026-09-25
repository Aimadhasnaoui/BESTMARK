import React, { useState, useEffect, useRef } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search, Package, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetProducts } from "@/Servises/Products";
import { getImageUrl } from "@/lib/utils";
import { useModelPermissions } from "@/hooks/usePermissions";

export default function NavSearch() {
  const { canView } = useModelPermissions("Produits");
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchData, isFetching: isSearching } = useQuery({
    queryKey: ["products-search", debouncedQuery],
    queryFn: () => GetProducts({ name: debouncedQuery }),
    enabled: canView && debouncedQuery.length > 0,
  });

  const searchResults = searchData?.products || [];

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectProduct = (product) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setDebouncedQuery("");
    navigate(`/products/${product._id}`);
  };

  if (!canView) return null;

  return (
    <div ref={searchRef} className="relative">
      <InputGroup className="h-10 w-[450px] rounded-full border-transparent bg-[#F1F5F9] px-1 shadow-none transition-all focus-within:border-[#2563EB] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#2563EB]/10">
        <InputGroupAddon className="pl-3">
          <Search className="h-4 w-4 text-[#94A3B8] transition-colors group-focus-within/input-group:text-[#2563EB]" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Rechercher produits, commandes, clients..."
          className="text-sm placeholder:text-[#94A3B8]"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => {
            if (searchQuery.trim()) setIsSearchOpen(true);
          }}
        />
        <InputGroupAddon align="inline-end" className="pr-2.5">
          {isSearching ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#94A3B8]" />
          ) : (
            <kbd className="hidden items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#94A3B8] sm:inline-flex">
              ⌘K
            </kbd>
          )}
        </InputGroupAddon>
      </InputGroup>

      {isSearchOpen && searchQuery.trim() && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
          {isSearching && (
            <div className="px-3 py-4 text-center text-sm text-[#94A3B8]">Recherche...</div>
          )}
          {!isSearching && searchResults.length === 0 && (
            <div className="px-3 py-4 text-center text-sm text-[#94A3B8]">
              Aucun produit trouvé pour "{searchQuery}"
            </div>
          )}
          {!isSearching &&
            searchResults.map((product) => (
              <button
                key={product._id}
                type="button"
                onClick={() => handleSelectProduct(product)}
                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[#F1F5F9]"
              >
                {product.image ? (
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="h-9 w-9 shrink-0 rounded-md border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-[#F1F5F9]">
                    <Package className="h-4 w-4 text-[#94A3B8]" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{product.name}</p>
                  <p className="truncate text-xs text-[#94A3B8]">
                    {product.category?.name ? `${product.category.name} · ` : ""}
                    {product.quantity} en stock
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium text-[#2563EB]">
                  {product.sellingPrice} DH
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
