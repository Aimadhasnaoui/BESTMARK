import Delivery from "./Delivery.js";
import { catchAsync } from "../utils/CatchFunction.js";
import APPError from "../utils/ErrorHandler.js";
import { createNotification } from "../Notifications/Controller.js";
import TranTransaction from "../Transactions/Transaction.js";
import Sale from "../sales/sales.js";
import Employee from "../Employes/Emplye/Employee.js";
import EmployeeType from "../Employes/typeemplois/EmployeeType.js";

const DELIVERY_PATH = "/delivery";

const STATUS_LABELS = {
  pending: "en attente",
  preparing: "en préparation",
  on_route: "en route",
  arrived: "livrée",
  failed: "échouée",
};

// Final statuses are reported to all Manager employees
const MANAGER_STATUS_TYPES = {
  arrived: "success",
  failed: "alert",
};

const notifyManager = async (message, type = "info") => {
  const managerType = await EmployeeType.findOne({ name: "Manager" }).select("_id");
  if (!managerType) return;
  const managers = await Employee.find({ mission: managerType._id, isActive: true }).select("_id");
  await Promise.all(
    managers.map((m) =>
      createNotification({ emploisId: m._id, message, path: DELIVERY_PATH, type }),
    ),
  );
};

const notifyLivreur = (delivery, message, type = "info") =>
  createNotification({
    emploisId: delivery.deliveryMan?._id,
    message,
    path: DELIVERY_PATH,
    type,
  });

const livreurName = (delivery) => delivery.deliveryMan?.name || "aucun livreur";

const notifyLivreurAssigned = (delivery, req) =>
  notifyLivreur(
    delivery,
    `${req.user.name} vous a assigné une nouvelle livraison (statut : ${STATUS_LABELS[delivery.status]}).`,
  );

export const CreateDelivery = catchAsync(async (req, res, next) => {
  const delivery = await Delivery.create(req.body);
  await delivery.populate("deliveryMan", "name");
  await notifyLivreurAssigned(delivery, req);
  res.status(201).json({ success: true, delivery });
});

const hasPermission = (permissions, model, action) => {
  const entry = (permissions || []).find((p) => p.model === model);
  return !!entry && (entry.actions || []).includes(action);
};

export const GetDeliveries = catchAsync(async (req, res, next) => {
  const permissions = req.user?.mission?.permissions || [];

  const hasFullAccess = hasPermission(permissions, "Livraisons", "Consulter");
  // "Consulter pour Utilisateur" is the scoped read action: livreur sees only their own
  const hasLivreurAccess = hasPermission(permissions, "Gestion des Livraisons", "Consulter pour Utilisateur");

  // A livreur (Gestion des Livraisons only) sees only their own assigned deliveries
  const filter =
    !hasFullAccess && hasLivreurAccess
      ? { deliveryMan: req.user._id }
      : {};

  const deliveries = await Delivery.find(filter)
    .populate("deliveryMan", "name")
    .populate({
      path: "sale",
      select: "invoiceNumber customerName items totalAmount paymentStatus payementInlivrisan paidAmount remainAmount",
      populate: {
        path: "items.product",
        select: "name",
      },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, deliveries });
});

export const GetDelivery = catchAsync(async (req, res, next) => {
  const delivery = await Delivery.findById(req.params.id)
    .populate("deliveryMan", "name")
    .populate({
      path: "sale",
      select: "invoiceNumber customerName items totalAmount paymentStatus payementInlivrisan paidAmount remainAmount",
      populate: {
        path: "items.product",
        select: "name",
      },
    });

  if (!delivery) {
    return next(
      new APPError(`Delivery with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, delivery });
});

export const UpdateDelivery = catchAsync(async (req, res, next) => {
  const { collectedAmount, ...updatePayload } = req.body;

  const previous = await Delivery.findById(req.params.id);
  if (!previous) {
    return next(
      new APPError(`Delivery with ID ${req.params.id} not found`, 404),
    );
  }
  await previous.populate("deliveryMan", "name");
  const delivery = await Delivery.findByIdAndUpdate(req.params.id, updatePayload, {
    new: true,
  }).populate("deliveryMan", "name").populate("sale");

  if (collectedAmount && Number(collectedAmount) > 0 && delivery.sale) {
    const amount = Number(collectedAmount);
    const saleId = delivery.sale._id || delivery.sale;
    const sale = await Sale.findById(saleId);

    if (sale) {
      await TranTransaction.create({
        type: "sale",
        direction: "in",
        amount: amount,
        referenceModel: "Sale",
        performedBy: req.user?._id || delivery.deliveryMan?._id || null,
        note: `Paiement à la livraison encaissé par ${delivery.deliveryMan?.name || req.user?.name || "livreur"} pour la facture ${sale.invoiceNumber || ""}`,
        referenceId: sale._id,
      });

      sale.paidAmount = (sale.paidAmount || 0) + amount;
      sale.remainAmount = Math.max(0, (sale.totalAmount || 0) - sale.paidAmount);
      if (sale.remainAmount <= 0) {
        sale.paymentStatus = "paid";
      } else if (sale.paidAmount > 0) {
        sale.paymentStatus = "partial";
      }
      await sale.save();
    }
  }

  // A newly assigned livreur is told about the delivery
  if (
    delivery.deliveryMan?._id?.toString() !==
    previous.deliveryMan?._id?.toString()
  ) {
    await notifyLivreurAssigned(delivery, req);
  }

  if (delivery.status !== previous.status) {
    if (delivery.status === "preparing") {
      // Livreur: the delivery is being prepared, get ready to pick it up
      await notifyLivreur(
        delivery,
        `Votre livraison est en préparation (mise à jour par ${req.user.name}).`,
      );
    } else if (MANAGER_STATUS_TYPES[delivery.status]) {
      // Manager: the delivery reached a final status (arrived / failed)
      await notifyManager(
        `La livraison de ${livreurName(delivery)} est ${STATUS_LABELS[delivery.status]} (mise à jour par ${req.user.name}).`,
        MANAGER_STATUS_TYPES[delivery.status],
      );
    }
  }

  res.status(200).json({ success: true, delivery });
});

export const DeleteDelivery = catchAsync(async (req, res, next) => {
  const delivery = await Delivery.findByIdAndDelete(req.params.id);
  if (!delivery) {
    return next(
      new APPError(`Delivery with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, delivery });
});
