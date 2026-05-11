import Transaction from "./Transaction.js";
import Purchases from "../Purchases/Purchases.js";
import { catchAsync } from "../utils/CatchFunction.js";
import APPError from "../utils/ErrorHandler.js";

export const CreateTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.create(req.body);
  res.status(201).json({ success: true, transaction });
});

export const GetTransactions = catchAsync(async (req, res, next) => {
  const transactions = await Transaction.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, transactions });
});

export const GetTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    return next(
      new APPError(`Transaction with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, transaction });
});
export const GetTransactionByRef = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findOne({ referenceId: req.params.ref });
  if (!transaction) {
    return next(
      new APPError(`Transaction with ID ${req.params.ref} not found`, 404),
    );
  }
  res.status(200).json({ success: true, transaction });
});

export const UpdateTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  if (!transaction) {
    return next(
      new APPError(`Transaction with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, transaction });
});

export const DeleteTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    return next(
      new APPError(`Transaction with ID ${req.params.id} not found`, 404),
    );
  }

  if (transaction.referenceModel === "Purchase" && transaction.referenceId) {
    const purchase = await Purchases.findById(transaction.referenceId);
    if (purchase) {
      return next(
        new APPError(
          "Cette transaction est liée à un achat. Vous devez supprimer l'achat pour que cette transaction soit supprimée automatiquement.",
          400,
        ),
      );
    }
  }

  await Transaction.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, transaction });
});
