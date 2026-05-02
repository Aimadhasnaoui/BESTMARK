import Supplier from "./Supplier.js";
import { catchAsync } from "../utils/CatchFunction.js";
import APPError from "../utils/ErrorHandler.js";

export const CreateSupplier = catchAsync(async (req, res, next) => {
  const supplier = await Supplier.create(req.body);
  res.status(201).json({ success: true, supplier });
});

export const GetSuppliers = catchAsync(async (req, res, next) => {
  const filters = {};
  if(req.query.name){
    filters.name = req.query.name;
  }
  if(req.query.productTypes){
    filters.productTypes = req.query.productTypes;
  }
  const suppliers = await Supplier.find(filters).populate("productTypes" , "name");
  res.status(200).json({ success: true, suppliers });
});

export const GetSupplier = catchAsync(async (req, res, next) => {
  const supplier = await Supplier.findById(req.params.id).populate("productTypes" , "name");
  if(!supplier){
    return next(new APPError(`Supplier with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, supplier });
});

export const UpdateSupplier = catchAsync(async (req, res, next) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!supplier){
    return next(new APPError(`Supplier with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, supplier });
});

export const DeleteSupplier = catchAsync(async (req, res, next) => {
  const supplier = await Supplier.findByIdAndDelete(req.params.id);
  if(!supplier){
    return next(new APPError(`Supplier with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, supplier });
});
