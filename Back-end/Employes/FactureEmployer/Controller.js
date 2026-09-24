import FactureEmploi from "./FactureEmplois.js";
import Employee from "../Emplye/Employee.js";
import TranTransaction from "../../Transactions/Transaction.js";
import { catchAsync, transactional } from "../../utils/CatchFunction.js";
import APPError from "../../utils/ErrorHandler.js";

// Keeps the payslip's "out" transaction in line with the amount actually paid
const syncPayslipTransaction = async (payslip, employee, performedBy, session) => {
  if (payslip.TotalVerser > 0) {
    await TranTransaction.findOneAndUpdate(
      { referenceId: payslip._id, referenceModel: "FactureEmploi" },
      {
        type: "expense",
        direction: "out",
        amount: payslip.TotalVerser,
        referenceModel: "FactureEmploi",
        referenceId: payslip._id,
        performedBy,
        note: `Paie de ${employee.name} pour ${String(payslip.mois).padStart(2, "0")}/${payslip.annee} (versé ${payslip.TotalVerser} DH sur ${payslip.salaire} DH)`,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, session },
    );
  } else {
    await TranTransaction.deleteMany({ referenceId: payslip._id }).session(session);
  }
};

export const CreatePayslip = transactional(async (req, res, next, session) => {
  const employee = await Employee.findById(req.body.employee).session(session);
  if (!employee) {
    throw new APPError("Employé introuvable", 404);
  }

  const alreadyExists = await FactureEmploi.exists({
    employee: req.body.employee,
    mois: req.body.mois,
    annee: req.body.annee,
  }).session(session);
  if (alreadyExists) {
    throw new APPError(
      `Un bulletin de paie existe déjà pour ${employee.name} en ${req.body.mois}/${req.body.annee}`,
      400,
    );
  }

  const [payslip] = await FactureEmploi.create([req.body], { session });
  await syncPayslipTransaction(payslip, employee, req.user._id, session);

  res.status(201).json({ success: true, payslip });
});

export const GetPayslips = catchAsync(async (req, res, next) => {
  const payslips = await FactureEmploi.find()
    .sort({ annee: -1, mois: -1 })
    .populate("employee", "name");
  res.status(200).json({ success: true, payslips });
});

export const GetEmployeePayslips = catchAsync(async (req, res, next) => {
  const payslips = await FactureEmploi.find({ employee: req.params.id }).sort({
    annee: -1,
    mois: -1,
  });
  res.status(200).json({ success: true, payslips });
});

export const GetPayslip = catchAsync(async (req, res, next) => {
  const payslip = await FactureEmploi.findById(req.params.id).populate(
    "employee",
    "name",
  );
  if (!payslip) {
    return next(new APPError(`Payslip with ID ${req.params.id} not found`, 404));
  }
  res.status(200).json({ success: true, payslip });
});

export const UpdatePayslip = transactional(async (req, res, next, session) => {
  const payslip = await FactureEmploi.findById(req.params.id).session(session);
  if (!payslip) {
    throw new APPError(`Payslip with ID ${req.params.id} not found`, 404);
  }

  // employee and period are fixed; reste is always recalculated
  const { salaire, avance, TotalVerser } = req.body;
  if (salaire !== undefined) payslip.salaire = salaire;
  if (avance !== undefined) payslip.avance = avance;
  if (TotalVerser !== undefined) payslip.TotalVerser = TotalVerser;
  await payslip.save({ session });

  const employee = await Employee.findById(payslip.employee).session(session);
  await syncPayslipTransaction(
    payslip,
    employee ?? { name: "employé supprimé" },
    req.user._id,
    session,
  );

  res.status(200).json({ success: true, payslip });
});

export const DeletePayslip = transactional(async (req, res, next, session) => {
  const payslip = await FactureEmploi.findByIdAndDelete(req.params.id).session(session);
  if (!payslip) {
    throw new APPError(`Payslip with ID ${req.params.id} not found`, 404);
  }
  await TranTransaction.deleteMany({ referenceId: payslip._id }).session(session);

  res.status(200).json({ success: true, payslip });
});
