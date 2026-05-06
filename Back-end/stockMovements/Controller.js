import StockMovement from "./StockMovement.js";
import Purchases from "../Purchases/Purchases.js";
import { catchAsync } from "../utils/CatchFunction.js";
import APPError from "../utils/ErrorHandler.js";

export const CreateStockMovement = catchAsync(async (req, res, next) => {
  const stockMovement = await StockMovement.create(req.body);
  res.status(201).json({ success: true, stockMovement });
});

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

export const UpdateStockMovement = catchAsync(async (req, res, next) => {
  const stockMovement = await StockMovement.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  if (!stockMovement) {
    return next(
      new APPError(`Stock movement with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, stockMovement });
});

export const DeleteStockMovement = catchAsync(async (req, res, next) => {
  const stockMovement = await StockMovement.findById(req.params.id);
  if (!stockMovement) {
    return next(
      new APPError(`Stock movement with ID ${req.params.id} not found`, 404),
    );
  }

  if (stockMovement.referenceModel === "Purchase" && stockMovement.referenceId) {
    const purchase = await Purchases.findById(stockMovement.referenceId);
    if (purchase) {
      return next(
        new APPError(
          "Ce mouvement de stock est lié à un achat. Vous devez supprimer l'achat pour que ce mouvement soit supprimé automatiquement.",
          400,
        ),
      );
    }
  }

  await StockMovement.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, stockMovement });
});
