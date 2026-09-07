import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetProduct } from "@/Servises/Products";
import { getImageUrl } from "@/lib/utils";
import { DataContext } from "@/Component/Data/contextApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  Truck,
  Layers,
  Barcode,
  BarChart3,
  Bell,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setOpenAddSellerModal, setOpenAddBuyerModal, setPrefillProduct } =
    useContext(DataContext);

  const { data, isPending, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => GetProduct(id),
  });

  const product = data?.product;
  const isLowStock = product && product.quantity <= product.minStockAlert;
  const isOutOfStock = product && product.quantity === 0;

  const handleSell = () => {
    setPrefillProduct(product);
    setOpenAddSellerModal(true);
  };

  const handleBuy = () => {
    setPrefillProduct(product);
    setOpenAddBuyerModal(true);
  };

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <Package className="h-10 w-10 text-red-400" />
        <p className="text-red-600 font-semibold">Produit introuvable.</p>
        <Button variant="outline" onClick={() => navigate("/products")}>
          Retour aux produits
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{product.name}</h1>
          <p className="text-sm text-slate-500">Détails du produit</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card size="sm" className="md:col-span-1">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
              {product.image ? (
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-16 w-16 text-slate-300" />
              )}
            </div>

            <div className="flex w-full flex-wrap gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                  isOutOfStock
                    ? "bg-red-50 text-red-700 border-red-100"
                    : isLowStock
                      ? "bg-amber-50 text-amber-700 border-amber-100"
                      : "bg-emerald-50 text-emerald-700 border-emerald-100"
                }`}
              >
                {isOutOfStock
                  ? "Rupture de stock"
                  : isLowStock
                    ? "Stock faible"
                    : "En stock"}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                <Layers className="w-3 h-3" />
                {product.category?.name}
              </span>
            </div>

            <div className="flex w-full gap-2">
              <Button
                className="flex-1 gap-1.5 bg-[#0050CB] text-white hover:bg-[#0040a3] cursor-pointer"
                onClick={handleSell}
                disabled={isOutOfStock}
              >
                <ShoppingCart className="h-4 w-4" />
                Vendre
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-1.5 cursor-pointer"
                onClick={handleBuy}
              >
                <Truck className="h-4 w-4" />
                Acheter
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card size="sm" className="md:col-span-2">
          <CardContent className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 mb-1">
                Description
              </h3>
              <p className="text-sm text-slate-700">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-green-50 text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Prix de vente</p>
                  <p className="font-bold text-sm text-slate-800">
                    {product.sellingPrice} DH
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Prix d'achat</p>
                  <p className="font-bold text-sm text-slate-800">
                    {product.buyingPrice} DH
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Quantité</p>
                  <p
                    className={`font-bold text-sm ${isLowStock ? "text-red-500" : "text-slate-800"}`}
                  >
                    {product.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-orange-50 text-orange-600">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Alerte stock</p>
                  <p className="font-bold text-sm text-slate-800">
                    {product.minStockAlert}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-purple-50 text-purple-600">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Ventes</p>
                  <p className="font-bold text-sm text-slate-800">
                    {product.Number_of_sales || 0}
                  </p>
                </div>
              </div>

              {product.barcode && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-50 text-slate-600">
                    <Barcode className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Code-barres</p>
                    <p className="font-bold text-sm text-slate-800">
                      {product.barcode}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 mb-2">
                Fournisseur
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
                  product.supplier
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-slate-50 text-slate-500 border-slate-200"
                }`}
              >
                {product.supplier?.name || "Aucun fournisseur"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
