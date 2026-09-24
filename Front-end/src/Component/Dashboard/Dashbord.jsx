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
import { GetDashboard } from "@/Servises/Dashboard";
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

const EXPENSE_TYPE_LABELS = { expense: "Dépense", purchase: "Achat", return: "Retour", sale: "Vente" };
const EXPENSE_COLORS = ["#f59e0b", "#3b82f6", "#a855f7", "#64748b"];

export default function Dashbord() {
  const navigate = useNavigate();
  const [showFinance, setShowFinance] = useState(false);

  // Every figure is computed by the server (GET /api/dashboard); only formatting happens here
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: GetDashboard });
  const dashboard = data?.dashboard;

  const monthlyRevenue = dashboard?.monthlyRevenue || 0;
  const previousMonthRevenue = dashboard?.previousMonthRevenue || 0;
  const monthlyBalance = dashboard?.monthlyBalance || 0;
  const lowStockCount = dashboard?.lowStockCount || 0;
  const outOfStockCount = dashboard?.outOfStockCount || 0;
  const alertProductsTotal = lowStockCount + outOfStockCount;
  const lateDeliveries = dashboard?.lateDeliveries || [];
  const recentSales = dashboard?.recentSales || [];
  const recentMovements = dashboard?.recentMovements || [];
  const topProducts = dashboard?.topProducts || [];
  const topCustomers = dashboard?.topCustomers || [];
  const vendorPerformance = dashboard?.vendorPerformance || [];

  const revenueChangePercent = useMemo(() => {
    if (previousMonthRevenue === 0) return monthlyRevenue > 0 ? 100 : 0;
    return ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
  }, [monthlyRevenue, previousMonthRevenue]);

  const financeChartData = useMemo(
    () =>
      (dashboard?.financeChart || []).map((m) => ({
        month: dayjs(m.month).format("MMM YY"),
        Entrées: m.in,
        Sorties: m.out,
      })),
    [dashboard],
  );

  const expenseByType = useMemo(
    () =>
      (dashboard?.expenseByType || []).map((e) => ({
        name: EXPENSE_TYPE_LABELS[e.type] || e.type,
        value: e.value,
      })),
    [dashboard],
  );

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
