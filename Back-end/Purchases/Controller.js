import Purchases from "./Purchases.js";
import { catchAsync, transactional } from "../utils/CatchFunction.js";
import Products from "../Products/Product/Products.js";
import TranTransaction from "../Transactions/Transaction.js";
import StockMovement from "../stockMovements/StockMovement.js";
import Suppliers from "../Supplieres/Supplier.js";
import APPError from "../utils/ErrorHandler.js";
import mongoose from "mongoose";
export const CreatePurchase = transactional(async (req, res, next, session) => {
  const supplier = await Suppliers.findById(req.body.supplier).session(session);
  if (!supplier) {
    throw new APPError("Supplier not found", 404);
  }

  const [purchase] = await Purchases.create([req.body], { session });
  const ProdcutsName = [];

  await supplier.save({ session });
  for (const item of req.body.items) {
    const product = await Products.findById(item.product).session(session);
    if (!product) {
      throw new APPError("Product not found", 404);
    }
    ProdcutsName.push(
      `(${product.name}) pour un montant de ${item.buyingPrice}`,
    );
    product.quantity += Number(item.quantity);
    await product.save({ session });

    await StockMovement.create(
      [
        {
          product: item.product,
          createdBy: req.user?.id ?? null,
          type: "purchase",
          quantity: item.quantity,
          quantityBefore: product.quantity - Number(item.quantity),
          quantityAfter: product.quantity,
          referenceModel: "Purchase",
          createdBy: req.body.user,
          referenceId: purchase._id,
        },
      ],
      { session },
    );
  }

  await TranTransaction.create(
    [
      {
        type: "purchase",
        direction: "out",
        amount: req.body.totalAmount,
        referenceModel: "Purchase",
        performedBy: req.user?.id ?? null,
        note: `acheter  les  produits (${ProdcutsName.join(",")})  pour un montant de ${req.body.totalAmount} a  fournisseur : ${supplier.name}`,
        referenceId: purchase._id,
      },
    ],
    { session },
  );
  res
    .status(201)
    .json({ success: true, message: "Operation  passe en  success" });
});

export const GetPurchases = catchAsync(async (req, res, next) => {
  const purchases = await Purchases.find().sort({ createdAt: -1 });

  res.status(200).json({ success: true, purchases });
});

export const GetPurchase = catchAsync(async (req, res, next) => {
  const purchase = await Purchases.findById(req.params.id);
  if (!purchase) {
    return next(
      new APPError(`Purchase with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, purchase });
});

export const UpdatePurchase = catchAsync(async (req, res, next) => {
  const purchase = await Purchases.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!purchase) {
    return next(
      new APPError(`Purchase with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, purchase });
});

export const DeletePurchase = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  let purchase;
  try {
    await session.withTransaction(async () => {
      purchase = await Purchases.findByIdAndDelete(req.params.id).session(
        session,
      );
      if (!purchase) {
        return next(
          new APPError(`Purchase with ID ${req.params.id} not found`, 404),
        );
      }
      for (const item of purchase.items) {
        const product = await Products.findById(item.product);
        if (!product) {
          return next(new APPError("Product not found", 404));
        }
        product.quantity -= Number(item.quantity);
        await product.save({ session });
      }

      await StockMovement.findOneAndDelete({ referenceId: req.params.id }).session(session);
      await TranTransaction.findOneAndDelete({ referenceId: req.params.id }).session(
        session,
      );
    });
  } catch (error) {
    return next(new APPError(error.message, 500));
  } finally {
    session.endSession();
  }
  if (!purchase) {
    return next(
      new APPError(`Purchase with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, purchase });
});
