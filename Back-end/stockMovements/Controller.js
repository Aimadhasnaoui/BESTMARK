import StockMovement from "./StockMovement.js";
import { catchAsync } from "../utils/CatchFunction.js";
import APPError from "../utils/ErrorHandler.js";

export const CreateStockMovement = catchAsync(async (req, res, next) => {
  const stockMovement = await StockMovement.create(req.body);
  res.status(201).json({ success: true, stockMovement });
});

export const GetStockMovements = catchAsync(async (req, res, next) => {
  const stockMovements = await StockMovement.find().populate("product", "name").populate("createdBy", "name");
  res.status(200).json({ success: true, stockMovements });
});

export const GetStockMovement = catchAsync(async (req, res, next) => {
  const stockMovement = await StockMovement.findById(req.params.id).populate("product", "name").populate("createdBy", "name");
  if(!stockMovement){
    return next(new APPError(`Stock movement with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, stockMovement });
});

export const UpdateStockMovement = catchAsync(async (req, res, next) => {
  const stockMovement = await StockMovement.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!stockMovement){
    return next(new APPError(`Stock movement with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, stockMovement });
});

export const DeleteStockMovement = catchAsync(async (req, res, next) => {
  const stockMovement = await StockMovement.findByIdAndDelete(req.params.id);
  if(!stockMovement){
    return next(new APPError(`Stock movement with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, stockMovement });
});
