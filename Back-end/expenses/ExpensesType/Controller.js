import ExpenseType from "./ExpenseType.js";
import { catchAsync } from "../../utils/CatchFunction.js";
import APPError from "../../utils/ErrorHandler.js";

export const CreateExpenseType = catchAsync(async (req, res, next) => {
  const expenseType = await ExpenseType.create(req.body);
  res.status(201).json({ success: true, expenseType });
});

export const GetExpenseTypes = catchAsync(async (req, res, next) => {
  const expenseTypes = await ExpenseType.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, expenseTypes });
});

export const GetExpenseType = catchAsync(async (req, res, next) => {
  const expenseType = await ExpenseType.findById(req.params.id);
  if (!expenseType) {
    return next(
      new APPError(`Expense type with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, expenseType });
});

export const UpdateExpenseType = catchAsync(async (req, res, next) => {
  const expenseType = await ExpenseType.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  if (!expenseType) {
    return next(
      new APPError(`Expense type with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, expenseType });
});

export const DeleteExpenseType = catchAsync(async (req, res, next) => {
  const expenseType = await ExpenseType.findByIdAndDelete(req.params.id);
  if (!expenseType) {
    return next(
      new APPError(`Expense type with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, expenseType });
});
