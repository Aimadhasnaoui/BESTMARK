import Category from "./Categrories.js";
import { catchAsync } from "../../utils/CatchFunction.js";
import APPError from "../../utils/ErrorHandler.js";

export const CreateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
});

export const GetCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({ success: true, categories });
});

export const GetCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if(!category){
    return next(new APPError(`Category with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, category });
});

export const UpdateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!category){
    return next(new APPError(`Category with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, category });
});

export const DeleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if(!category){
    return next(new APPError(`Category with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, category });
});
