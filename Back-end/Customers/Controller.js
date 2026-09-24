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
  const existingRequest = await CustomerRequest.findById(req.params.id);
  if (!existingRequest) {
    return next(
      new APPError(`Customer request with ID ${req.params.id} not found`, 404),
    );
  }

  // notifiedAt is managed by the server: set on the first switch to "notified",
  // cleared if the request goes back to "pending"
  delete req.body.notifiedAt;
  if (req.body.status === "notified" && !existingRequest.notifiedAt) {
    req.body.notifiedAt = new Date();
  } else if (req.body.status === "pending") {
    req.body.notifiedAt = null;
  }

  const customerRequest = await CustomerRequest.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  ).populate("product", "name barcode");
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
