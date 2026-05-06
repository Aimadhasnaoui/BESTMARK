import Delivery from "./Delivery.js";
import { catchAsync } from "../utils/CatchFunction.js";
import APPError from "../utils/ErrorHandler.js";

export const CreateDelivery = catchAsync(async (req, res, next) => {
  const delivery = await Delivery.create(req.body);
  res.status(201).json({ success: true, delivery });
});

export const GetDeliveries = catchAsync(async (req, res, next) => {
  const deliveries = await Delivery.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, deliveries });
});

export const GetDelivery = catchAsync(async (req, res, next) => {
  const delivery = await Delivery.findById(req.params.id);
  if (!delivery) {
    return next(
      new APPError(`Delivery with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, delivery });
});

export const UpdateDelivery = catchAsync(async (req, res, next) => {
  const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!delivery) {
    return next(
      new APPError(`Delivery with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, delivery });
});

export const DeleteDelivery = catchAsync(async (req, res, next) => {
  const delivery = await Delivery.findByIdAndDelete(req.params.id);
  if (!delivery) {
    return next(
      new APPError(`Delivery with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, delivery });
});
