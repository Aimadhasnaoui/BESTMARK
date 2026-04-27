import EmployeeType from "./EmployeeType.js";
import { catchAsync } from "../../utils/CatchFunction.js";
import APPError from "../../utils/ErrorHandler.js";

export const CreateEmployeeType = catchAsync(async (req, res, next) => {
  const employeeType = await EmployeeType.create(req.body);
  res.status(201).json({ success: true, employeeType });
});

export const GetEmployeeTypes = catchAsync(async (req, res, next) => {
  const employeeTypes = await EmployeeType.find();
  res.status(200).json({ success: true, employeeTypes });
});

export const GetEmployeeType = catchAsync(async (req, res, next) => {
  const employeeType = await EmployeeType.findById(req.params.id);
  if(!employeeType){
    return next(new APPError(`Employee type with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, employeeType });
});

export const UpdateEmployeeType = catchAsync(async (req, res, next) => {
  const employeeType = await EmployeeType.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!employeeType){
    return next(new APPError(`Employee type with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, employeeType });
});

export const DeleteEmployeeType = catchAsync(async (req, res, next) => {
  const employeeType = await EmployeeType.findByIdAndDelete(req.params.id);
  if(!employeeType){
    return next(new APPError(`Employee type with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, employeeType });
});
