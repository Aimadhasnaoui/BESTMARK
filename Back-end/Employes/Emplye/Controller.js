import Employee from "./Employee.js";
import { catchAsync } from "../../utils/CatchFunction.js";
import APPError from "../../utils/ErrorHandler.js";

export const CreateEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.create(req.body);
  res.status(201).json({ success: true, employee });
});

export const GetEmployees = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.query.mission) {
    filter.mission = req.query.mission;
  }
  const employees = await Employee.find(filter).populate("mission", "name");
  res.status(200).json({ success: true, employees });
});

export const GetEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id).populate(
    "mission",
    "name",
  );
  if (!employee) {
    return next(
      new APPError(`Employee with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, employee });
});

export const UpdateEmployee = catchAsync(async (req, res, next) => {
  // don't allow changing password or isActive status via general update
  if (req.body.password || req.body.isActive) {
    return next(new APPError(`you can't procces whit the chnage here`, 400));
  }

  const id = req.params.id === "me" ? req.user?._id : req.params.id;

  if (req.body.mission === "" || req.body.mission === "undefined" || req.body.mission === "null") {
    delete req.body.mission;
  }

  const employee = await Employee.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).populate("mission", "name permissions");

  if (!employee) {
    return next(
      new APPError(`Employee with ID ${id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, employee });
});

export const DeleteEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) {
    return next(
      new APPError(`Employee with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, employee });
});
