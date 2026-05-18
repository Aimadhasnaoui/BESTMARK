import Sale from "./sales.js";
import { catchAsync, transactional } from "../utils/CatchFunction.js";
import APPError from "../utils/ErrorHandler.js";
import Delivery from "../Delivery/Delivery.js";
import Products from "../Products/Product/Products.js";
import TranTransaction from "../Transactions/Transaction.js";
import StockMovement from "../stockMovements/StockMovement.js";
export const CreateSale = transactional(async (req, res, next, session) => {
  const {
    requiresDelivery,
    items,
    deliveryfees,
    deliveryAddress,
    deliveryMan,
  } = req.body;

  // Generate unique sequential invoice number: INV-YYYYMMDD-XXX
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const salesCountToday = await Sale.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  }).session(session);

  const sequenceNum = String(salesCountToday + 1).padStart(3, "0");
  const invoiceNumber = `INV-${dateStr}-${sequenceNum}`;

  req.body.invoiceNumber = invoiceNumber;

  const [saledata] = await Sale.create([req.body], session);
  const ProdcutsName = [];

  for (const item of items) {
    const product = await Products.findById(item.product).session(session);
    if (!product) {
      throw new APPError("Product not found", 404);
    }
    ProdcutsName.push(
      `(${product.name}) pour un montant de ${item.buyingPrice}`,
    );
    product.quantity -= Number(item.quantity);
    await product.save({ session });

    await StockMovement.create(
      [
        {
          product: item.product,
          createdBy: req.user?.id ?? null,
          type: "sale",
          quantity: -Number(item.quantity),
          quantityAfter: product.quantity ,
          quantityBefore: product.quantity + Number(item.quantity),
          referenceModel: "Sale",
          createdBy: req.body.servedBy,
          referenceId: saledata._id,
        },
      ],
      { session },
    );
  }

  await TranTransaction.create(
    [
      {
        type: "sale",
        direction: "in",
        amount: req.body.paidAmount,
        referenceModel: "Sale",
        performedBy: req.body.servedBy ?? null,
        note: `vendre  les  produits (${ProdcutsName.join(",")})  pour un montant de ${req.body.paidAmount} a  client : ${req.body.customerName}`,
        referenceId: saledata._id,
      },
    ],
    { session },
  );
  if (requiresDelivery) {
    const [Deliverydata] = await Delivery.create([
      {
        sale: saledata._id,
        deliveryMan: deliveryMan,
        deliveryAddress: deliveryAddress,
        deliveryfees: deliveryfees,
      },
      session,
    ]);
  }
  res.status(201).json({ success: true, saledata });
});

export const GetSales = catchAsync(async (req, res, next) => {
  const sales = await Sale.find()
    .sort({ createdAt: -1 })
    .populate("servedBy", "deliveryMan");
  res.status(200).json({ success: true, sales });
});

export const GetSale = catchAsync(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id).populate(
    "servedBy",
    "deliveryMan",
  );
  if (!sale) {
    return next(new APPError(`Sale with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, sale });
});

export const UpdateSale = catchAsync(async (req, res, next) => {
  const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!sale) {
    return next(new APPError(`Sale with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, sale });
});

export const DeleteSale = catchAsync(async (req, res, next) => {
  const sale = await Sale.findByIdAndDelete(req.params.id);
  if (!sale) {
    return next(new APPError(`Sale with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, sale });
});
