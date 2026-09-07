import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import HeaderPage from "../UI/HeaderPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GetSales } from "@/Servises/Sales";
import { GetStockMovements } from "@/Servises/StockMovements";
import { GetTransactions } from "@/Servises/Transactions";
import { GetDeliverys } from "@/Servises/Delivery";
import { GetProducts, GetLowStockProducts } from "@/Servises/Products";
import {
  Wallet,
  AlertTriangle,
  Truck,
  ArrowUpCircle,
  ArrowDownCircle,
  Archive,
  ArrowRight,
  Eye,
  EyeOff,
  LineChart,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Users,
  Award,
  MapPin,
  Phone,
} from "lucide-react";

const isLateDelivery = (delivery) => {
  if (!delivery.estimatedArrival) return false;
  if (delivery.status === "arrived" || delivery.status === "failed") return false;
  return new Date(delivery.estimatedArrival) < new Date();
};

const EXPENSE_TYPE_LABELS = { expense: "Dépense", purchase: "Achat", return: "Retour", sale: "Vente" };
const EXPENSE_COLORS = ["#f59e0b", "#3b82f6", "#a855f7", "#64748b"];

export default function Dashbord() {
  const navigate = useNavigate();
  const [showFinance, setShowFinance] = useState(false);

  const { data: salesData } = useQuery({ queryKey: ["sales"], queryFn: GetSales });
  const { data: movementsData } = useQuery({ queryKey: ["stockMovements"], queryFn: GetStockMovements });
  const { data: transactionsData } = useQuery({ queryKey: ["transactions"], queryFn: () => GetTransactions() });
  const { data: deliveriesData } = useQuery({ queryKey: ["deliveries"], queryFn: GetDeliverys });
  const { data: productsData } = useQuery({ queryKey: ["products"], queryFn: () => GetProducts() });
  const { data: lowStockData } = useQuery({ queryKey: ["products", "low-stock"], queryFn: GetLowStockProducts });

  const monthStart = useMemo(() => dayjs().startOf("month"), []);

  const monthlyRevenue = useMemo(() => {
    return (salesData?.sales || [])
      .filter((s) => dayjs(s.saleDate).isAfter(monthStart))
      .reduce((acc, s) => acc + (s.totalAmount || 0), 0);
  }, [salesData, monthStart]);

  const monthlyBalance = useMemo(() => {
    return (transactionsData?.transactions || [])
      .filter((t) => dayjs(t.date).isAfter(monthStart))
      .reduce((acc, t) => acc + (t.direction === "in" ? t.amount : -t.amount), 0);
  }, [transactionsData, monthStart]);

  const lateDeliveries = useMemo(() => {
    return (deliveriesData?.deliveries || []).filter(isLateDelivery);
  }, [deliveriesData]);

  const outOfStockCount = useMemo(() => {
    return (productsData?.products || []).filter((p) => p.quantity === 0).length;
  }, [productsData]);

  const lowStockCount = lowStockData?.products?.length || 0;
  const alertProductsTotal = lowStockCount + outOfStockCount;

  const financeChartData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) =>
      dayjs().subtract(5 - i, "month").startOf("month"),
    );
    return months.map((start) => {
      const end = start.endOf("month");
      const monthTx = (transactionsData?.transactions || []).filter((t) => {
        const d = dayjs(t.date);
        return d.isAfter(start) && d.isBefore(end);
      });
      return {
        month: start.format("MMM YY"),
        Entrées: monthTx
          .filter((t) => t.direction === "in")
          .reduce((acc, t) => acc + (t.amount || 0), 0),
        Sorties: monthTx
          .filter((t) => t.direction === "out")
          .reduce((acc, t) => acc + (t.amount || 0), 0),
      };
    });
  }, [transactionsData]);

  const recentSales = useMemo(() => (salesData?.sales || []).slice(0, 5), [salesData]);
  const recentMovements = useMemo(() => (movementsData?.stockMovements || []).slice(0, 5), [movementsData]);

  const previousMonthRevenue = useMemo(() => {
    const previousMonthStart = dayjs().subtract(1, "month").startOf("month");
    const previousMonthEnd = dayjs().subtract(1, "month").endOf("month");
    return (salesData?.sales || [])
      .filter((s) => dayjs(s.saleDate).isAfter(previousMonthStart) && dayjs(s.saleDate).isBefore(previousMonthEnd))
      .reduce((acc, s) => acc + (s.totalAmount || 0), 0);
  }, [salesData]);

  const revenueChangePercent = useMemo(() => {
    if (previousMonthRevenue === 0) return monthlyRevenue > 0 ? 100 : 0;
    return ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
  }, [monthlyRevenue, previousMonthRevenue]);

  const topProducts = useMemo(() => {
    return [...(productsData?.products || [])]
      .sort((a, b) => (b.Number_of_sales || 0) - (a.Number_of_sales || 0))
      .slice(0, 5)
      .map((p) => ({ name: p.name, ventes: p.Number_of_sales || 0 }));
  }, [productsData]);

  const expenseByType = useMemo(() => {
    const map = {};
    (transactionsData?.transactions || [])
      .filter((t) => t.direction === "out")
      .forEach((t) => {
        map[t.type] = (map[t.type] || 0) + (t.amount || 0);
      });
    return Object.entries(map).map(([type, value]) => ({
      name: EXPENSE_TYPE_LABELS[type] || type,
      value,
    }));
  }, [transactionsData]);

  const topCustomers = useMemo(() => {
    const map = new Map();
    (salesData?.sales || [])
      .filter((s) => s.customerName)
      .forEach((s) => {
        const entry = map.get(s.customerName) || { name: s.customerName, total: 0, count: 0 };
        entry.total += s.totalAmount || 0;
        entry.count += 1;
        map.set(s.customerName, entry);
      });
    return Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [salesData]);

  const vendorPerformance = useMemo(() => {
    const map = new Map();
    (salesData?.sales || []).forEach((s) => {
      const name = s.servedBy?.name || "N/A";
      const entry = map.get(name) || { name, total: 0, count: 0 };
      entry.total += s.totalAmount || 0;
      entry.count += 1;
      map.set(name, entry);
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [salesData]);

  return (
    <div className="space-y-4">
      <HeaderPage
        title="Tableau de bord"
        description="Vue d'ensemble de votre activité"
      >
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          onClick={() => setShowFinance((v) => !v)}
          title={showFinance ? "Masquer les chiffres financiers" : "Afficher les chiffres financiers"}
        >
          {showFinance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </HeaderPage>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">
              Chiffre d'affaires (mois)
            </CardTitle>
            <div className="bg-emerald-500/10 p-1.5 rounded-full">
              <Wallet className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold">
                {showFinance ? `${monthlyRevenue.toLocaleString("fr-FR")} DH` : "•••• DH"}
              </div>
              {showFinance && (
                <span
                  className={`flex items-center gap-0.5 text-xs font-semibold ${revenueChangePercent >= 0 ? "text-emerald-600" : "text-red-600"}`}
                >
                  {revenueChangePercent >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(revenueChangePercent).toFixed(0)}%
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400">vs mois précédent</p>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">
              Solde net (mois)
            </CardTitle>
            <div
              className={`p-1.5 rounded-full ${monthlyBalance >= 0 ? "bg-blue-500/10" : "bg-red-500/10"}`}
            >
              {monthlyBalance >= 0 ? (
                <ArrowUpCircle className="h-4 w-4 text-blue-600" />
              ) : (
                <ArrowDownCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-xl font-bold ${monthlyBalance >= 0 ? "text-slate-900" : "text-red-600"}`}
            >
              {showFinance ? `${monthlyBalance.toLocaleString("fr-FR")} DH` : "•••• DH"}
            </div>
          </CardContent>
        </Card>

        <Card
          size="sm"
          className="cursor-pointer transition-shadow hover:shadow-md"
          onClick={() => navigate("/products")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">
              Produits à surveiller
            </CardTitle>
            <div className="bg-amber-500/10 p-1.5 rounded-full">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{alertProductsTotal}</div>
            <p className="my-2 text-xs">
              <span className="font-medium text-amber-600">{lowStockCount} stock faible</span>
              <span className="text-slate-300"> · </span>
              <span className="font-medium text-red-600">{outOfStockCount} rupture</span>
            </p>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">
              Livraisons en retard
            </CardTitle>
            <div className="bg-red-500/10 p-1.5 rounded-full">
              <Truck className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{lateDeliveries.length}</div>
            <p className="text-xs text-red-600 my-2">Nécessite un suivi</p>
          </CardContent>
        </Card>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <LineChart className="h-4 w-4 text-blue-600" />
            Aperçu financier (6 derniers mois)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => `${value.toLocaleString("fr-FR")} DH`}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Entrées" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Sorties" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 lg:flex-row">
        <Card size="sm" className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              Top produits vendus
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">
                Aucune vente enregistrée
              </p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topProducts}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                      width={100}
                    />
                    <Tooltip
                      formatter={(value) => `${value} ventes`}
                      contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                    />
                    <Bar dataKey="ventes" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card size="sm" className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <PieChartIcon className="h-4 w-4 text-amber-600" />
              Répartition des dépenses par type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenseByType.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">
                Aucune dépense enregistrée
              </p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByType}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {expenseByType.map((entry, index) => (
                        <Cell key={entry.name} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${value.toLocaleString("fr-FR")} DH`}
                      contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
      <Card size="sm" className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm font-semibold text-slate-700">
              Dernières ventes
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-blue-600 cursor-pointer"
                onClick={() => navigate("/sales")}
              >
                Voir tout <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentSales.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">
                Aucune vente récente
              </p>
            )}
            {recentSales.map((sale) => (
              <div
                key={sale._id}
                className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800">
                    {sale.customerName || "Client comptant"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {sale.invoiceNumber} ·{" "}
                    {dayjs(sale.saleDate).format("DD/MM/YYYY HH:mm")}
                  </span>
                </div>
                <span className="text-sm font-bold text-emerald-600">
                  +{(sale.totalAmount || 0).toLocaleString("fr-FR")} DH
                </span>
              </div>
            ))}
          </CardContent>
      </Card>

      <Card size="sm" className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-sm font-semibold text-slate-700">
            Derniers mouvements de stock
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-600 cursor-pointer"
              onClick={() => navigate("/stock")}
            >
              Voir tout <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {recentMovements.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-400">
              Aucun mouvement récent
            </p>
          )}
          {recentMovements.map((movement) => (
            <div
              key={movement._id}
              className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
            >
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800">
                    {movement.product?.name || "N/A"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {dayjs(movement.createdAt).format("DD/MM/YYYY HH:mm")} ·{" "}
                    {movement.createdBy?.name}
                  </span>
                </div>
              </div>
              <span
                className={`text-sm font-bold ${movement.quantity > 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {movement.quantity > 0 ? "+" : ""}
                {movement.quantity}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Truck className="h-4 w-4 text-red-600" />
            Livraisons en retard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {lateDeliveries.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-400">
              Aucune livraison en retard
            </p>
          )}
          {lateDeliveries.map((delivery) => (
            <div
              key={delivery._id}
              className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">
                  {delivery.sale?.customerName || "Client comptant"}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="h-3 w-3" />
                  {delivery.deliveryAddress?.city || "N/A"}
                  {delivery.deliveryAddress?.phone && (
                    <>
                      <Phone className="ml-1 h-3 w-3" />
                      {delivery.deliveryAddress.phone}
                    </>
                  )}
                </span>
              </div>
              <span className="text-sm font-bold text-red-600">
                {dayjs().diff(dayjs(delivery.estimatedArrival), "day")}j de retard
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 lg:flex-row">
        <Card size="sm" className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Award className="h-4 w-4 text-amber-600" />
              Meilleurs clients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {topCustomers.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">
                Aucun client identifié
              </p>
            )}
            {topCustomers.map((customer) => (
              <div
                key={customer.name}
                className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800">{customer.name}</span>
                  <span className="text-xs text-slate-400">{customer.count} achat(s)</span>
                </div>
                <span className="text-sm font-bold text-emerald-600">
                  {customer.total.toLocaleString("fr-FR")} DH
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card size="sm" className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Users className="h-4 w-4 text-blue-600" />
              Performance par vendeur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {vendorPerformance.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">
                Aucune vente enregistrée
              </p>
            )}
            {vendorPerformance.map((vendor) => (
              <div
                key={vendor.name}
                className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800">{vendor.name}</span>
                  <span className="text-xs text-slate-400">{vendor.count} vente(s)</span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  {vendor.total.toLocaleString("fr-FR")} DH
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
