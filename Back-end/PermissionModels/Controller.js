import PermissionModel from "./PermissionModel.js";
import { catchAsync } from "../utils/CatchFunction.js";
import APPError from "../utils/ErrorHandler.js";

export const CreatePermissionModel = catchAsync(async (req, res, next) => {
  const permissionModel = await PermissionModel.create(req.body);
  res.status(201).json({ success: true, permissionModel });
});

export const GetPermissionModels = catchAsync(async (req, res, next) => {
  const permissionModels = await PermissionModel.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, permissionModels });
});

export const GetPermissionModel = catchAsync(async (req, res, next) => {
  const permissionModel = await PermissionModel.findById(req.params.id);
  if (!permissionModel) {
    return next(
      new APPError(`Permission model with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, permissionModel });
});

export const UpdatePermissionModel = catchAsync(async (req, res, next) => {
  const permissionModel = await PermissionModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );
  if (!permissionModel) {
    return next(
      new APPError(`Permission model with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, permissionModel });
});

export const DeletePermissionModel = catchAsync(async (req, res, next) => {
  const permissionModel = await PermissionModel.findByIdAndDelete(req.params.id);
  if (!permissionModel) {
    return next(
      new APPError(`Permission model with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, permissionModel });
});
