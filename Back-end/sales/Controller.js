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
          quantityAfter: product.quantity,
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
    const [Deliverydata] = await Delivery.create(
      [
        {
          sale: saledata._id,
          deliveryMan: deliveryMan,
          deliveryAddress: {
            street: req.body.street || (typeof req.body.deliveryAddress === "string" ? req.body.deliveryAddress : req.body.deliveryAddress?.street || ""),
            city: req.body.city || req.body.deliveryAddress?.city || "",
            phone: req.body.customerPhone || req.body.deliveryAddress?.phone || "",
            notes: req.body.notes || req.body.deliveryAddress?.notes || "",
          },
          deliveryfees: deliveryfees,
        },
      ],
      { session },
    );

    saledata.deliveryId = Deliverydata._id;
    await saledata.save({ session });
  }
  res.status(201).json({ success: true, saledata });
});

export const GetSales = catchAsync(async (req, res, next) => {
  const sales = await Sale.find()
    .sort({ createdAt: -1 })
    .populate("servedBy", "name")
    .populate({
      path: "deliveryId",
      populate: {
        path: "deliveryMan",
        select: "name",
      },
    });
    
  res.status(200).json({ success: true, sales });
});

export const GetSale = catchAsync(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id)
    .populate("servedBy", "name")
    .populate({
      path: "deliveryId",
      populate: {
        path: "deliveryMan",
        select: "name",
      },
    });
  if (!sale) {
    return next(new APPError(`Sale with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, sale });
});

export const UpdateSale = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const saleData = await Sale.findById(req.params.id);
  if (!saleData) {
    return next(new APPError(`Sale with ID ${req.params.id} not found`, 404));
  }

  // Remove deliveryId from update body to prevent overwriting the relation ID with an employee ID
  if (req.body.sale) {
    delete req.body.sale.deliveryId;
  }

  const sale = await Sale.findByIdAndUpdate(req.params.id, req.body.sale, {
    new: true,
  });

  if (req.body.delevrydata && req.body.delevrydata.deliveryMan) {
    // Format delivery address string to object compatibility if necessary
    const formattedAddress = typeof req.body.delevrydata.deliveryAddress === "string"
      ? { street: req.body.delevrydata.deliveryAddress }
      : req.body.delevrydata.deliveryAddress;

    const deliveryPayload = {
      deliveryMan: req.body.delevrydata.deliveryMan,
      deliveryAddress: formattedAddress,
      deliveryfees: req.body.delevrydata.deliveryfees,
    };

    let delivery = await Delivery.findOne({ sale: sale._id });

    if (!delivery) {
      // Create new delivery document
      delivery = await Delivery.create({
        sale: sale._id,
        ...deliveryPayload,
      });
    } else {
      // Update existing delivery document
      delivery = await Delivery.findByIdAndUpdate(delivery._id, deliveryPayload, {
        new: true,
      });
    }

    // Ensure the sale document is correctly linked to the Delivery document ID
    sale.deliveryId = delivery._id;
    await sale.save();
  } else {
    // If no delivery is required, delete any associated delivery documents
    await Delivery.deleteMany({ sale: sale._id });
    sale.deliveryId = null;
    await sale.save();
  }

  res.status(200).json({ success: true, sale });
});

export const DeleteSale = transactional(async (req, res, next, session) => {
  const sale = await Sale.findById(req.params.id).session(session);
  if (!sale) {
    throw new APPError(`Sale with ID ${req.params.id} not found`, 404);
  }

  // Delete associated StockMovement records if they exist
  const stockMovementsExist = await StockMovement.exists({
    referenceId: sale._id,
  });
  if (stockMovementsExist) {
    await StockMovement.deleteMany({ referenceId: sale._id }).session(session);
  }

  // Delete associated TranTransaction records if they exist
  const transactionsExist = await TranTransaction.exists({
    referenceId: sale._id,
  });
  if (transactionsExist) {
    await TranTransaction.deleteMany({ referenceId: sale._id }).session(
      session,
    );
  }

  // Delete associated Delivery records if they exist
  const deliveryExists = await Delivery.exists({ sale: sale._id });
  if (deliveryExists) {
    await Delivery.deleteMany({ sale: sale._id }).session(session);
  }

  // Delete the Sale document itself
  await Sale.findByIdAndDelete(sale._id).session(session);

  res.status(200).json({ success: true, sale });
});
