import CustomerRequest from "./CustomerRequest.js";
import { catchAsync } from "../utils/CatchFunction.js";
import APPError from "../utils/ErrorHandler.js";

export const CreateCustomerRequest = catchAsync(async (req, res, next) => {
  const customerRequest = await CustomerRequest.create(req.body);
  res.status(201).json({ success: true, customerRequest });
});

export const GetCustomerRequests = catchAsync(async (req, res, next) => {
  const customerRequests = await CustomerRequest.find()
    .sort({ createdAt: -1 })
    .populate("product", "name barcode");
  res.status(200).json({ success: true, customerRequests });
});

export const GetCustomerRequest = catchAsync(async (req, res, next) => {
  const customerRequest = await CustomerRequest.findById(
    req.params.id,
  ).populate("product", "name barcode");
  if (!customerRequest) {
    return next(
      new APPError(`Customer request with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, customerRequest });
});

export const UpdateCustomerRequest = catchAsync(async (req, res, next) => {
  const customerRequest = await CustomerRequest.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  if (!customerRequest) {
    return next(
      new APPError(`Customer request with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, customerRequest });
});

export const DeleteCustomerRequest = catchAsync(async (req, res, next) => {
  const customerRequest = await CustomerRequest.findByIdAndDelete(
    req.params.id,
  );
  if (!customerRequest) {
    return next(
      new APPError(`Customer request with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, customerRequest });
});
