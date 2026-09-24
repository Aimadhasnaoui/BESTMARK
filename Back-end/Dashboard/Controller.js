import Sale from "../sales/sales.js";
import Transaction from "../Transactions/Transaction.js";
import Delivery from "../Delivery/Delivery.js";
import Product from "../Products/Product/Products.js";
import StockMovement from "../stockMovements/StockMovement.js";
import "../Employes/Emplye/Employee.js"; // registers the model used by populate("createdBy")
import { catchAsync } from "../utils/CatchFunction.js";

const CHART_MONTHS = 6;
const TOP_LIMIT = 5;

const sumSales = async (from, to) => {
  const match = { saleDate: { $gte: from, ...(to && { $lt: to }) } };
  const [result] = await Sale.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);
  return result?.total || 0;
};

// Every figure shown on the dashboard, computed by MongoDB in a single request
export const GetDashboard = catchAsync(async (req, res, next) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  // Start of each of the last CHART_MONTHS months, plus the start of next month as the upper bound
  const monthBoundaries = Array.from(
    { length: CHART_MONTHS + 1 },
    (_, i) => new Date(now.getFullYear(), now.getMonth() - (CHART_MONTHS - 1) + i, 1),
  );

  const [
    monthlyRevenue,
    previousMonthRevenue,
    [balance],
    lowStockCount,
    outOfStockCount,
    lateDeliveries,
    monthlyFlows,
    expenseByType,
    topProducts,
    topCustomers,
    vendorPerformance,
    recentSales,
    recentMovements,
  ] = await Promise.all([
    sumSales(monthStart),
    sumSales(previousMonthStart, monthStart),

    Transaction.aggregate([
      { $match: { date: { $gte: monthStart } } },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $cond: [{ $eq: ["$direction", "in"] }, "$amount", { $multiply: ["$amount", -1] }] },
          },
        },
      },
    ]),

    Product.countDocuments({ quantity: { $gt: 0 }, $expr: { $lte: ["$quantity", "$minStockAlert"] } }),
    Product.countDocuments({ quantity: { $lte: 0 } }),

    Delivery.find({
      status: { $nin: ["arrived", "failed"] },
      estimatedArrival: { $lt: now },
    })
      .sort({ estimatedArrival: 1 })
      .select("deliveryAddress estimatedArrival status sale")
      .populate("sale", "customerName invoiceNumber"),

    Transaction.aggregate([
      { $match: { date: { $gte: monthBoundaries[0], $lt: monthBoundaries[CHART_MONTHS] } } },
      {
        $bucket: {
          groupBy: "$date",
          boundaries: monthBoundaries,
          output: {
            in: { $sum: { $cond: [{ $eq: ["$direction", "in"] }, "$amount", 0] } },
            out: { $sum: { $cond: [{ $eq: ["$direction", "out"] }, "$amount", 0] } },
          },
        },
      },
    ]),

    Transaction.aggregate([
      { $match: { direction: "out" } },
      { $group: { _id: "$type", value: { $sum: "$amount" } } },
      { $project: { _id: 0, type: "$_id", value: 1 } },
      { $sort: { value: -1 } },
    ]),

    Product.find({ Number_of_sales: { $gt: 0 } })
      .sort({ Number_of_sales: -1 })
      .limit(TOP_LIMIT)
      .select("name Number_of_sales"),

    Sale.aggregate([
      { $match: { customerName: { $nin: [null, ""] } } },
      { $group: { _id: "$customerName", total: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: TOP_LIMIT },
      { $project: { _id: 0, name: "$_id", total: 1, count: 1 } },
    ]),

    Sale.aggregate([
      { $group: { _id: "$servedBy", total: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
      { $lookup: { from: "employees", localField: "_id", foreignField: "_id", as: "employee" } },
      { $project: { _id: 0, name: { $ifNull: [{ $first: "$employee.name" }, "N/A"] }, total: 1, count: 1 } },
      { $sort: { total: -1 } },
    ]),

    Sale.find()
      .sort({ createdAt: -1 })
      .limit(TOP_LIMIT)
      .select("customerName invoiceNumber saleDate totalAmount"),

    StockMovement.find()
      .sort({ createdAt: -1 })
      .limit(TOP_LIMIT)
      .select("product createdBy quantity createdAt")
      .populate("product", "name")
      .populate("createdBy", "name"),
  ]);

  // One entry per month, including months without any transaction
  const financeChart = monthBoundaries.slice(0, CHART_MONTHS).map((start) => {
    const flow = monthlyFlows.find((f) => f._id.getTime() === start.getTime());
    return { month: start, in: flow?.in || 0, out: flow?.out || 0 };
  });

  res.status(200).json({
    success: true,
    dashboard: {
      monthlyRevenue,
      previousMonthRevenue,
      monthlyBalance: balance?.total || 0,
      lowStockCount,
      outOfStockCount,
      lateDeliveries,
      financeChart,
      expenseByType,
      topProducts: topProducts.map((p) => ({ name: p.name, ventes: p.Number_of_sales })),
      topCustomers,
      vendorPerformance,
      recentSales,
      recentMovements,
    },
  });
});
