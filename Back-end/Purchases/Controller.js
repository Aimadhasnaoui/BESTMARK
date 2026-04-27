import Purchases from "./Purchases.js";
import { catchAsync } from "../utils/CatchFunction.js";
import APPError from "../utils/ErrorHandler.js";

export const CreatePurchase = catchAsync(async (req, res, next) => {
  const purchase = await Purchases.create(req.body);
  res.status(201).json({ success: true, purchase });
});

export const GetPurchases = catchAsync(async (req, res, next) => {
  const purchases = await Purchases.find();
  res.status(200).json({ success: true, purchases });
});

export const GetPurchase = catchAsync(async (req, res, next) => {
  const purchase = await Purchases.findById(req.params.id);
  if(!purchase){
    return next(new APPError(`Purchase with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, purchase });
});

export const UpdatePurchase = catchAsync(async (req, res, next) => {
  const purchase = await Purchases.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!purchase){
    return next(new APPError(`Purchase with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, purchase });
});

export const DeletePurchase = catchAsync(async (req, res, next) => {
  const purchase = await Purchases.findByIdAndDelete(req.params.id);
  if(!purchase){
    return next(new APPError(`Purchase with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, purchase });
});
