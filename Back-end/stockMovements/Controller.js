import StockMovement from "./StockMovement.js";
import Purchases from "../Purchases/Purchases.js";
import { catchAsync, transactional } from "../utils/CatchFunction.js";
import APPError from "../utils/ErrorHandler.js";
import Products from "../Products/Product/Products.js";
import Transactions from "../Transactions/Transaction.js";
import mongoose from "mongoose";

export const CreateStockMovement = transactional(
  async (req, res, next, session) => {
    const { product, type, quantity, price, note } = req.body;
    const [stock] = await StockMovement.create([{ ...req.body }], { session });;
    switch (type) {
      case "return":
        await Products.findByIdAndUpdate(
          product,
          { quantity: req.body.quantityAfter },
          { session },
        );
        break;
      case "adjustment":
        await Products.findByIdAndUpdate(
          product,
          { quantity: req.body.quantityAfter },
          { session },
        );
        break;
    }
    if (type === "return") {
      await Transactions.create(
        [
          {
            type: "return",
            amount: price,
            direction: "out",
            note: `${note}`,
            referenceId: stock._id,
            referenceModel: "return",
            performedBy: stock.createdBy,
          },
        ],
        { session },
      );
    }
    res
      .status(201)
      .json({ success: true, message: "Operation  passe en  success" });
  },
);

export const GetStockMovements = catchAsync(async (req, res, next) => {
  const stockMovements = await StockMovement.find()
    .sort({ createdAt: -1 })
    .populate("product", "name")
    .populate("createdBy", "name");
  res.status(200).json({ success: true, stockMovements });
});

export const GetStockMovement = catchAsync(async (req, res, next) => {
  const stockMovement = await StockMovement.findById(req.params.id)
    .populate("product", "name")
    .populate("createdBy", "name");
  if (!stockMovement) {
    return next(
      new APPError(`Stock movement with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, stockMovement });
});

export const UpdateStockMovement = transactional(
  async (req, res, next, session) => {
    const { quantity, price, note, prodcutQantity } = req.body;

    // 1. Get the current stock movement
    let stockMovement = await StockMovement.findById(req.params.id).session(
      session,
    );
    if (!stockMovement) {
      throw new APPError(`Mouvement de stock non trouvé`, 404);
    }

    stockMovement = await StockMovement.findByIdAndUpdate(
      req.params.id,
      {
        quantity: Number(quantity),
        price: Number(price),
        note: note,
        quantityAfter: Number(prodcutQantity),
      },
      { new: true, session },
    );
    // 4. Update the Product stock to match the new calculation
    await Products.findByIdAndUpdate(
      stockMovement.product,
      { quantity: Number(prodcutQantity) },
      { session },
    );

    // 5. Update the associated Transaction amount if it's a return
    if (price !== undefined && stockMovement.type === "return") {
      await Transactions.findOneAndUpdate(
        { referenceId: stockMovement._id },
        {
          amount: Number(price),
          note: note,
        },
        { session },
      );
    }


    res.status(200).json({ success: true, stockMovement });
  },
);

export const DeleteStockMovement = transactional(
  async (req, res, next, session) => {
    const stockMovement = await StockMovement.findById(req.params.id).session(
      session,
    );

    if (!stockMovement) {
      throw new APPError(`Mouvement de stock non trouvé`, 404);
    }

    // 1. Check if linked to an active Purchase
    if (
      stockMovement.referenceModel === "Purchase" &&
      stockMovement.referenceId
    ) {
      const purchase = await Purchases.findById(
        stockMovement.referenceId,
      ).session(session);
      if (purchase) {
        throw new APPError(
          "Ce mouvement est lié à un achat. Supprimez l'achat pour que ce mouvement soit supprimé automatiquement.",
          400,
        );
      }
    }

    // 2. Restore Product Quantity (Rollback the movement)
    await Products.findByIdAndUpdate(
      stockMovement.product,
      { quantity: stockMovement.quantityBefore },
      { session },
    );

    // 3. Delete associated Transaction (e.g., for returns)
    await Transactions.findOneAndDelete(
      { referenceId: stockMovement._id },
      { session },
    );

    // 4. Finally, delete the movement itself
    await StockMovement.findByIdAndDelete(req.params.id).session(session);

    res.status(200).json({
      success: true,
      message: "Mouvement supprimé et stock restauré avec succès",
    });
  },
);
