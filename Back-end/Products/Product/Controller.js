import Product from "./Products.js";
import { catchAsync } from "../../utils/CatchFunction.js";
import APPError from "../../utils/ErrorHandler.js";

export const CreateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

export const GetProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({ success: true, products });
});

export const GetProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if(!product){
    return next(new APPError(`Product with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, product });
});

export const UpdateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!product){
    return next(new APPError(`Product with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, product });
});

export const DeleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if(!product){
    return next(new APPError(`Product with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, product });
});
