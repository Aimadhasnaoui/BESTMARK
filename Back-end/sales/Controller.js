import Sale from "./sales.js";
import { catchAsync } from "../utils/CatchFunction.js";
import APPError from "../utils/ErrorHandler.js";

export const CreateSale = catchAsync(async (req, res, next) => {
  const sale = await Sale.create(req.body);
  res.status(201).json({ success: true, sale });
});

export const GetSales = catchAsync(async (req, res, next) => {
  const sales = await Sale.find();
  res.status(200).json({ success: true, sales });
});

export const GetSale = catchAsync(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id);
  if(!sale){
    return next(new APPError(`Sale with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, sale });
});

export const UpdateSale = catchAsync(async (req, res, next) => {
  const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!sale){
    return next(new APPError(`Sale with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, sale });
});

export const DeleteSale = catchAsync(async (req, res, next) => {
  const sale = await Sale.findByIdAndDelete(req.params.id);
  if(!sale){
    return next(new APPError(`Sale with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, sale });
});
