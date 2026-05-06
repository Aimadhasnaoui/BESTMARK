import Expense from "./Expense.js";
import { catchAsync } from "../../utils/CatchFunction.js";
import APPError from "../../utils/ErrorHandler.js";

export const CreateExpense = catchAsync(async (req, res, next) => {
  const expense = await Expense.create(req.body);
  res.status(201).json({ success: true, expense });
});

export const GetExpenses = catchAsync(async (req, res, next) => {
  const expenses = await Expense.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, expenses });
});

export const GetExpense = catchAsync(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    return next(
      new APPError(`Expense with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, expense });
});

export const UpdateExpense = catchAsync(async (req, res, next) => {
  const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!expense) {
    return next(
      new APPError(`Expense with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, expense });
});

export const DeleteExpense = catchAsync(async (req, res, next) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) {
    return next(
      new APPError(`Expense with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, expense });
});
