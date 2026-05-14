import { catchAsync } from "../utils/CatchFunction.js";
import User from "./User.js";
import APPError from "../utils/ErrorHandler.js";

export const CreatUser = catchAsync(async (req, res, next) => {
  const existUser = await User.find({ phone: req.body.phone });
  if (existUser.length > 0) {
    return next(
      new APPError(
        `User ${req.body.name} already exists` +
          ` with phone number ${req.body.phone}`,
        400,
      ),
    );
  }
  const user = await User.create(req.body);
  res.status(201).json({ success: true, user });
});

export const GetUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, users });
});

export const GetUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new APPError(`User with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, user });
});

export const UpdateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!user) {
    return next(new APPError(`User with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, user });
});

export const DeleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new APPError(`User with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, user });
});
