import Product from "./Products.js";
import { catchAsync, transactional } from "../../utils/CatchFunction.js";
import APPError from "../../utils/ErrorHandler.js";
import StockMovement from "../../stockMovements/StockMovement.js";

export const CreateProduct = transactional(async (req, res, next, session) => {
  const [product] = await Product.create([req.body], { session });
  if (product.quantity > 0) {
    await StockMovement.create(
      [
        {
          product: product._id,
          createdBy: req.user?._id,
          type: "adjustment",
          quantity: product.quantity,
          quantityBefore: 0,
          quantityAfter: product.quantity,
          referenceModel: "manual",
          note: "Stock initial à la création du produit",
        },
      ],
      { session },
    );
  }
  res.status(201).json({ success: true, product });
});

export const GetProducts = catchAsync(async (req, res, next) => {
  const filter ={}
  const { supplier,category } = req.query
  if(supplier){
    filter.supplier = supplier
  }
  if(category){
    filter.category = category
  }
  const products = await Product.find(filter).populate("category","name").populate("supplier","name");
  res.status(200).json({ success: true, products });
});

export const GetLowStockProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    quantity: { $gt: 0 },
    $expr: { $lte: ["$quantity", "$minStockAlert"] },
  })
    .populate("category", "name")
    .populate("supplier", "name");
  res.status(200).json({ success: true, products });
});

export const GetProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("category","name").populate("supplier","name");
  if(!product){
    return next(new APPError(`Product with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, product });
});

export const UpdateProduct = catchAsync(async (req, res, next) => {
  const hasSupplier = req.body.hassupplier === true || req.body.hassupplier === "true";
  if (!hasSupplier || !req.body.supplier || req.body.supplier === "undefined") {
    delete req.body.supplier;
  }
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
