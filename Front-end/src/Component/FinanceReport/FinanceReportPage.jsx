import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { GetTransactions } from "@/Servises/Transactions";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  Percent,
  LineChart,
  PieChart as PieChartIcon,
  Calendar,
  ArrowRightLeft,
  X,
} from "lucide-react";

const TYPE_LABELS = { sale: "Vente", expense: "Dépense", purchase: "Achat", return: "Retour" };
const EXPENSE_COLORS = ["#f59e0b", "#3b82f6", "#a855f7", "#64748b"];
const INCOME_COLORS = ["#10b981", "#64748b"];
const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export default function FinanceReportPage() {
  const currentYear = dayjs().year();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  const handleMonthChange = (value) => {
    setMonthFilter(value);
    if (value === "") {
      setDateFrom("");
      setDateTo("");
      return;
    }
    const start = dayjs().year(currentYear).month(Number(value)).startOf("month");
    setDateFrom(start.format("YYYY-MM-DD"));
    setDateTo(start.endOf("month").format("YYYY-MM-DD"));
  };

  const { data, isPending } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => GetTransactions(),
  });

  const allTransactions = useMemo(() => data?.transactions || [], [data]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((t) => {
      if (typeFilter && t.type !== typeFilter) return false;
      if (dateFrom && new Date(t.date) < new Date(dateFrom)) return false;
      if (dateTo) {
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (new Date(t.date) > endOfDay) return false;
      }
      return true;
    });
  }, [allTransactions, typeFilter, dateFrom, dateTo]);

  const hasActiveFilters = !!(typeFilter || dateFrom || dateTo || monthFilter);
  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setTypeFilter("");
    setMonthFilter("");
  };

  const totalIn = useMemo(
    () => filteredTransactions.filter((t) => t.direction === "in").reduce((acc, t) => acc + (t.amount || 0), 0),
    [filteredTransactions],
  );
  const totalOut = useMemo(
    () => filteredTransactions.filter((t) => t.direction === "out").reduce((acc, t) => acc + (t.amount || 0), 0),
    [filteredTransactions],
  );
  const netBalance = totalIn - totalOut;
  const margin = totalIn > 0 ? (netBalance / totalIn) * 100 : 0;

  const trendData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => dayjs().subtract(11 - i, "month").startOf("month"));
    const source = typeFilter ? allTransactions.filter((t) => t.type === typeFilter) : allTransactions;
    return months.map((start) => {
      const end = start.endOf("month");
      const monthTx = source.filter((t) => {
        const d = dayjs(t.date);
        return d.isAfter(start) && d.isBefore(end);
      });
      return {
        month: start.format("MMM YY"),
        Entrées: monthTx.filter((t) => t.direction === "in").reduce((acc, t) => acc + (t.amount || 0), 0),
        Sorties: monthTx.filter((t) => t.direction === "out").reduce((acc, t) => acc + (t.amount || 0), 0),
      };
    });
  }, [allTransactions, typeFilter]);

  const breakdownByType = useMemo(() => {
    const map = {};
    filteredTransactions.forEach((t) => {
      const key = t.type;
      if (!map[key]) map[key] = { type: key, in: 0, out: 0, count: 0 };
      if (t.direction === "in") map[key].in += t.amount || 0;
      else map[key].out += t.amount || 0;
      map[key].count += 1;
    });
    return Object.values(map).sort((a, b) => b.in + b.out - (a.in + a.out));
  }, [filteredTransactions]);

  const expenseByType = useMemo(() => {
    return breakdownByType
      .filter((b) => b.out > 0)
      .map((b) => ({ name: TYPE_LABELS[b.type] || b.type, value: b.out }));
  }, [breakdownByType]);

  const incomeByType = useMemo(() => {
    return breakdownByType
      .filter((b) => b.in > 0)
      .map((b) => ({ name: TYPE_LABELS[b.type] || b.type, value: b.in }));
  }, [breakdownByType]);

  return (
    <div className="space-y-4">
      <HeaderPage
        title="Rapport Financier"
        description="Analyse détaillée de vos entrées et sorties d'argent"
      />

      <div className="flex flex-wrap items-end gap-4 p-4 my-1 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="flex flex-col gap-1.5 min-w-42.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-500" />
            Type
          </label>
          <TextField select size="small" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <MenuItem value="">Tous les types</MenuItem>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className="flex flex-col gap-1.5 min-w-45">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <Calendar className="w-3.5 h-3.5 text-purple-500" />
            Mois ({currentYear})
          </label>
          <TextField select size="small" value={monthFilter} onChange={(e) => handleMonthChange(e.target.value)}>
            <MenuItem value="">Tous les mois</MenuItem>
            {MONTHS_FR.map((label, index) => (
              <MenuItem key={label} value={String(index)}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className="flex flex-col gap-1.5 min-w-40">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            Du
          </label>
          <TextField
            type="date"
            size="small"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setMonthFilter("");
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5 min-w-40">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            Au
          </label>
          <TextField
            type="date"
            size="small"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setMonthFilter("");
            }}
          />
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={resetFilters}
            className="gap-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
            Réinitialiser
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">Total entrées</CardTitle>
            <div className="bg-emerald-500/10 p-1.5 rounded-full">
              <ArrowUpCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-emerald-600">{totalIn.toLocaleString("fr-FR")} DH</div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">Total sorties</CardTitle>
            <div className="bg-red-500/10 p-1.5 rounded-full">
              <ArrowDownCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">{totalOut.toLocaleString("fr-FR")} DH</div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">Solde net</CardTitle>
            <div className="bg-blue-500/10 p-1.5 rounded-full">
              <Wallet className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${netBalance >= 0 ? "text-slate-900" : "text-red-600"}`}>
              {netBalance.toLocaleString("fr-FR")} DH
            </div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">Marge</CardTitle>
            <div className="bg-amber-500/10 p-1.5 rounded-full">
              <Percent className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${margin >= 0 ? "text-slate-900" : "text-red-600"}`}>
              {margin.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <LineChart className="h-4 w-4 text-blue-600" />
            Évolution mensuelle (12 derniers mois)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
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
              <PieChartIcon className="h-4 w-4 text-emerald-600" />
              Répartition des entrées par type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incomeByType.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">Aucune entrée sur la période</p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={incomeByType} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                      {incomeByType.map((entry, index) => (
                        <Cell key={entry.name} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
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

        <Card size="sm" className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <PieChartIcon className="h-4 w-4 text-amber-600" />
              Répartition des dépenses par type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenseByType.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">Aucune dépense sur la période</p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseByType} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
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

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-700">Détail par type de transaction</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {!isPending && breakdownByType.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">Aucune transaction sur la période</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                  <th className="py-2 font-medium">Type</th>
                  <th className="py-2 font-medium">Nb. transactions</th>
                  <th className="py-2 font-medium">Entrées</th>
                  <th className="py-2 font-medium">Sorties</th>
                  <th className="py-2 font-medium">Solde</th>
                </tr>
              </thead>
              <tbody>
                {breakdownByType.map((row) => (
                  <tr key={row.type} className="border-b border-slate-100 last:border-0">
                    <td className="py-2 font-medium text-slate-800">{TYPE_LABELS[row.type] || row.type}</td>
                    <td className="py-2 text-slate-600">{row.count}</td>
                    <td className="py-2 text-emerald-600">{row.in.toLocaleString("fr-FR")} DH</td>
                    <td className="py-2 text-red-600">{row.out.toLocaleString("fr-FR")} DH</td>
                    <td className={`py-2 font-semibold ${row.in - row.out >= 0 ? "text-slate-800" : "text-red-600"}`}>
                      {(row.in - row.out).toLocaleString("fr-FR")} DH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
